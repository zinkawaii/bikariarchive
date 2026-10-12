import { readFile } from "node:fs/promises";
import { toString } from "mdast-util-to-string";
import { basename, resolve } from "pathe";
import { visit } from "unist-util-visit";
import { parseArticle, parseEntry } from "../markdown/index.ts";
import { defineProcessor } from "../processor/kerria.ts";
import { useLoad } from "../processor/useLoad.ts";
import { useSource } from "../processor/useSource.ts";
import { prepareSqlite } from "../processor/useSqlite.ts";
import { isDevelopment } from "../utils.ts";
import type { Child, Root } from "../markdown/types.ts";
import type { ArticleFrontmatter, NovelFrontmatter } from "../types/article.ts";

const SourceKind = {
  Meta: 0,
  Article: 1,
};

export default defineProcessor("Article", () => {
  const metaInfo = useLoad("meta", {
    dist: "content/generated/data/article.json",
    output(val) {
      const newVal = Object.fromEntries(
        Object.entries<any>(structuredClone(val))
          .sort(([, { order: a }], [, { order: b }]) => a.localeCompare(b)),
      );
      for (const novel in newVal) {
        delete newVal[novel].order;
        newVal[novel].chapters = Object.entries(newVal[novel].chapters)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([, c]) => c);
      }
      return newVal;
    },
  });

  const mapInfo = useLoad("map", {
    dist: "content/generated/data/artmap.json",
  });

  useSource(SourceKind.Meta, {
    base: "content",
    folders: [
      "novel",
    ],
    ext: ".md",
    deep: false,
    async parse(path) {
      // 处理文件
      const file = await readFile(path, "utf-8");
      const { attributes } = await parseEntry<NovelFrontmatter>(file);
      const [order, novel] = basename(path, ".md").split("-");

      // 写入缓存
      return {
        novel,
        order,
        data: attributes,
      };
    },
    cache(cache) {
      const { novel, order, data } = cache;

      mapInfo.value[novel] ??= {};
      metaInfo.value[novel] = {
        ...data,
        order,
        chapters: metaInfo.value[novel]?.chapters ?? [],
      };
    },
    unlink(cache) {
      const { novel } = cache;

      delete mapInfo.value[novel];
      delete metaInfo.value[novel];
    },
  });

  const article = useArticle();
  const search = useSearch();

  useSource(SourceKind.Article, {
    base: "content",
    dist: "content/generated",
    folders: [
      "novel",
    ],
    ext: ".md",
    skip: 1,
    async parse(path) {
      // 处理文件
      const file = await readFile(path, "utf-8");
      const { attributes, body } = await parseArticle<ArticleFrontmatter>(file);

      // 生产环境下忽略草稿文件
      if (attributes.draft && !isDevelopment) {
        return null;
      }

      // 解析文件名
      const match = basename(resolve(path, "..")).match(/^(.*?)\.(\d+)$/)!;
      const novel = match[1];
      const volume = Number(match[2]);
      const name = basename(path, ".md");

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
      await article.write(novel, index, body);

      // 写入索引
      await search.write(novel, index, paragraphs);

      // 写入数据
      const data = {
        index,
        volume,
        encrypted,
        wordCount,
        ...attributes,
      };

      // 写入缓存
      return {
        order,
        novel,
        password,
        data,
      };
    },
    cache(cache) {
      const { order, novel, password, data } = cache;
      const { index } = data;

      metaInfo.value[novel].chapters[order] = data;
      mapInfo.value[novel][index] = {
        password,
      };
    },
    async unlink(cache) {
      const { order, novel, data } = cache;
      const { index } = data;

      delete mapInfo.value[novel][index];
      delete metaInfo.value[novel].chapters[order];

      await article.remove(novel, index);
      await search.remove(novel, index);
    },
  });
});

function useArticle() {
  const ready = prepareSqlite((instance) => {
    instance.exec(/* SQL */`
      CREATE TABLE IF NOT EXISTS article (
        novel TEXT NOT NULL,
        chapter TEXT NOT NULL,
        body TEXT NOT NULL,
        PRIMARY KEY (novel, chapter)
      );
    `);
  });

  async function write(novel: string, chapter: string, body: Root) {
    const instance = await ready();

    instance.prepare(/* SQL */`
      INSERT INTO article (novel, chapter, body)
      VALUES (?, ?, ?)
      ON CONFLICT (novel, chapter)
      DO UPDATE SET
        body = excluded.body
    `).run(novel, chapter, JSON.stringify(body));
  }

  async function remove(novel: string, chapter: string) {
    const instance = await ready();

    instance.prepare(/* SQL */`
      DELETE FROM article
      WHERE novel = ? AND chapter = ?
    `).run(novel, chapter);
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
        rowid INTEGER PRIMARY KEY,
        novel TEXT NOT NULL,
        chapter TEXT NOT NULL,
        sequence INTEGER NOT NULL,
        content TEXT NOT NULL,
        children TEXT NOT NULL,
        UNIQUE(novel, chapter, sequence)
      );
    `);
  });

  async function write(novel: string, chapter: string, paragraphs: [string, Child[]][]) {
    const instance = await ready();

    instance.exec("BEGIN IMMEDIATE");

    try {
      instance.prepare(/* SQL */`
        DELETE FROM search
        WHERE novel = ? AND chapter = ?
      `).run(novel, chapter);

      const insert = instance.prepare(/* SQL */`
        INSERT INTO search (novel, chapter, sequence, content, children)
        VALUES (?, ?, ?, ?, ?)
      `);

      for (const [sequence, [text, children]] of paragraphs.entries()) {
        insert.run(novel, chapter, sequence, text, JSON.stringify(children));
      }

      instance.exec("COMMIT");
    }
    catch (error) {
      instance.exec("ROLLBACK");
      throw error;
    }
  }

  async function remove(novel: string, chapter: string) {
    const instance = await ready();

    instance.prepare(/* SQL */`
      DELETE FROM search
      WHERE novel = ? AND chapter = ?
    `).run(novel, chapter);
  }

  return {
    write,
    remove,
  };
}
