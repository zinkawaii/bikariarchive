import { readFile } from "node:fs/promises";
import { toString } from "mdast-util-to-string";
import { basename, relative, resolve } from "pathe";
import { visit } from "unist-util-visit";
import { parseArticle, parseEntry } from "../markdown/index.ts";
import { defineProcessor } from "../processor/kerria.ts";
import { prepareSqlite } from "../processor/sqlite.ts";
import { useLoad } from "../processor/useLoad.ts";
import { useSource } from "../processor/useSource.ts";
import type { Child, Root } from "../markdown/types.ts";
import type { ArticleFrontmatter, JArticle, JChapter, NovelFrontmatter } from "../types/article.ts";

const SourceKind = {
  Meta: 0,
  Article: 1,
};

export default defineProcessor("Article", (ctx) => {
  const metaInfo = useLoad<
    Record<string, NovelFrontmatter & {
      order: string;
      chapters: Record<string, JChapter>;
    }>
  >("meta", {
    dist: "content/generated/data/article.json",
    output(val): JArticle {
      return Object.fromEntries(
        Object.entries(val)
          .sort(([, { order: a }], [, { order: b }]) => a.localeCompare(b))
          .map(([novel, { order, ...info }]) => [novel, {
            ...info,
            chapters: Object.entries(info.chapters)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([, c]) => c),
          }]),
      );
    },
  });

  useSource(SourceKind.Meta, {
    base: "content/novel",
    ext: ".md",
    deep: false,
    async parse(path, info) {
      // 处理文件
      const file = await readFile(path, "utf-8");
      const { attributes } = await parseEntry<NovelFrontmatter>(file);
      const [order, novel] = basename(path, info.ext).split("-");

      // 写入缓存
      return {
        novel,
        order,
        data: attributes,
      };
    },
    cache(cache) {
      const { novel, order, data } = cache;

      metaInfo.value[novel] = {
        ...data,
        order,
        chapters: metaInfo.value[novel]?.chapters ?? [],
      };
    },
    unlink(cache) {
      const { novel } = cache;

      delete metaInfo.value[novel];
    },
  });

  const article = useArticle();
  const search = useSearch();

  useSource(SourceKind.Article, {
    base: "content/novel",
    ext: ".md",
    skip: 1,
    async parse(path, info) {
      // 处理文件
      const file = await readFile(path, "utf-8");
      const { attributes, body } = await parseArticle<ArticleFrontmatter>(file);

      // 生产环境下忽略草稿文件
      if (attributes.draft && !ctx.dev) {
        return null;
      }

      // 解析文件名
      const match = basename(resolve(path, "..")).match(/^(.*?)\.(\d+)$/)!;
      const novel = match[1];
      const volume = Number(match[2]);
      const key = relative(ctx.base, path);
      const name = basename(path, info.ext);

      // 简介转换
      const firstChild = body.children[0];
      if (firstChild?.type === "element" && firstChild?.tag === "excerpt") {
        const node = firstChild.children[0];
        if (node?.type === "element" && node?.tag === "p") {
          attributes.excerpt = node.children;
          body.children.splice(0, 1);
        }
      }

      // 内容加密
      const password = String(attributes.password || "") || void 0;
      const encrypted = Boolean(password) || void 0;
      delete attributes.password;

      // 字数统计
      const paragraphs: [string, Child[]][] = [];
      let wordCount = 0;

      visit(body, "element", (node) => {
        if (node.tag === "p") {
          const text = toString(node);

          if (!encrypted) {
            paragraphs.push([text, node.children]);
          }
          wordCount += text.length;
        }
      });

      // 生成映射
      let order = `[${volume}]`;
      let index = "";
      switch (metaInfo.value[novel].type) {
        case "novel": {
          const match = name.match(/^([^-]*)-(.*)$/)!;
          order += match[1];
          index = match[2];
          break;
        }
        case "blog": {
          if (!attributes.abbrlink) {
            return null;
          }
          order += name;
          index = attributes.abbrlink;
          delete attributes.abbrlink;
          break;
        }
      }

      // 写入产物
      await article.write(key, novel, index, body, password);

      // 写入索引
      await search.write(key, paragraphs);

      // 写入数据
      const chapter: JChapter = {
        index,
        volume,
        encrypted,
        wordCount,
        ...attributes,
      };

      // 写入缓存
      return {
        key,
        order,
        novel,
        chapter,
      };
    },
    cache(cache) {
      const { order, novel, chapter } = cache;

      metaInfo.value[novel].chapters[order] = chapter;
    },
    async unlink(cache) {
      const { key, order, novel } = cache;

      delete metaInfo.value[novel].chapters[order];
      await article.remove(key);
    },
  });
});

function useArticle() {
  const ready = prepareSqlite((instance) => {
    instance.exec(/* SQL */`
      CREATE TABLE IF NOT EXISTS article (
        key TEXT NOT NULL,
        novel TEXT NOT NULL,
        chapter TEXT NOT NULL,
        body TEXT NOT NULL,
        password TEXT,
        PRIMARY KEY (key),
        UNIQUE (novel, chapter)
      );
    `);
  });

  async function write(key: string, novel: string, chapter: string, body: Root, password?: string) {
    const instance = await ready();

    instance.prepare(/* SQL */`
      INSERT INTO article (key, novel, chapter, body, password)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT (key)
      DO UPDATE SET
        novel = excluded.novel,
        chapter = excluded.chapter,
        body = excluded.body,
        password = excluded.password
    `).run(key, novel, chapter, JSON.stringify(body), password ?? null);
  }

  async function remove(key: string) {
    const instance = await ready();

    instance.prepare(/* SQL */`
      DELETE FROM article
      WHERE key = ?
    `).run(key);
  }

  return {
    write,
    remove,
  };
}

function useSearch() {
  const ready = prepareSqlite((instance) => {
    instance.exec(/* SQL */`
      CREATE TABLE IF NOT EXISTS search (
        article_key TEXT NOT NULL,
        sequence INTEGER NOT NULL,
        content TEXT NOT NULL,
        children TEXT NOT NULL,
        PRIMARY KEY (article_key, sequence),
        FOREIGN KEY (article_key)
          REFERENCES article (key)
          ON UPDATE CASCADE
          ON DELETE CASCADE
      );
    `);
  });

  async function write(key: string, paragraphs: [string, Child[]][]) {
    const instance = await ready();

    instance.exec("BEGIN IMMEDIATE");

    try {
      instance.prepare(/* SQL */`
        DELETE FROM search
        WHERE article_key = ?
      `).run(key);

      const insert = instance.prepare(/* SQL */`
        INSERT INTO search (article_key, sequence, content, children)
        VALUES (?, ?, ?, ?)
      `);

      for (const [sequence, [text, children]] of paragraphs.entries()) {
        insert.run(key, sequence, text, JSON.stringify(children));
      }

      instance.exec("COMMIT");
    }
    catch (error) {
      instance.exec("ROLLBACK");
      throw error;
    }
  }

  return {
    write,
  };
}
