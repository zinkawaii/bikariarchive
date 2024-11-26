import { isDev } from "@bikari/shared";
import dayjs from "dayjs";
import fs from "fs-extra";
import { toString } from "mdast-util-to-string";
import { basename, resolve } from "pathe";
import { visit } from "unist-util-visit";
import { parseArticle, parseEntry } from "../remark";
import Processor from "./processor";
import type { Element } from "../remark/types";
import type { ArticleFrontmatter, NovelFrontmatter } from "./types";

enum SourceKind {
    Meta,
    Article
}

const PATH_REGEX = /^(.*?)\.(\d+)$/;

export default new Processor({
    sign: "Article",
    source: {
        base: "data",
        dist: "dist",
        folders: [
            "novel"
        ],
        ext: ".mdz"
    },
    meta: {
        out: "dist/json/Article.json"
    },
    map: {
        out: "dist/json/Artmap.json"
    },
    resolveSourceKind(filename) {
        return filename.split("/").at(-2) === "novel" ? SourceKind.Meta : SourceKind.Article;
    },
    parse(kind, filename) {
        switch (kind) {
            case SourceKind.Meta:
                return processMeta(filename);
            case SourceKind.Article:
                return processArticle(this, filename);
        }
    },
    unlink(kind, cache) {
        switch (kind) {
            case SourceKind.Meta: {
                const { novel } = cache;

                delete this.jMap[novel];
                delete this.jMeta[novel];
                break;
            }
            case SourceKind.Article: {
                const { order, novel, data } = cache;
                const { index } = data;

                delete this.jMap[novel][index];
                delete this.jMeta[novel].chapters[order];
                break;
            }
        }
    },
    onCacheHit(kind, cache) {
        switch (kind) {
            case SourceKind.Meta: {
                const { novel, data } = cache;

                if (!(novel in this.jMeta)) {
                    this.jMap[novel] = {};
                    this.jMeta[novel] = {
                        chapters: []
                    };
                }
                Object.assign(this.jMeta[novel], data);
                break;
            }
            case SourceKind.Article: {
                const { order, name, novel, data } = cache;
                const { index, password } = data;

                this.jMeta[novel].chapters[order] = data;
                this.jMap[novel][index] = {
                    name,
                    password
                };
                break;
            }
        }
    },
    beforeOutputMeta() {
        const jMeta = structuredClone(this.jMeta);
        for (const novel in jMeta) {
            jMeta[novel].chapters = Object.entries(jMeta[novel].chapters)
                .toSorted(([a], [b]) => a.localeCompare(b))
                .map(([_, c]) => c);
        }
        return jMeta;
    }
});

async function processMeta(filename: string) {
    //处理文件
    const file = await fs.readFile(filename);
    const attributes = await parseEntry<NovelFrontmatter>(file.toString());
    const novel = basename(filename, ".mdz").split("-")[1];

    //写入缓存
    return {
        novel,
        data: attributes
    };
}

async function processArticle(processor: Processor, filename: string) {
    //处理文件
    const file = await fs.readFile(filename);
    const { attributes, body } = await parseArticle<ArticleFrontmatter>(file.toString());

    //生产环境下忽略草稿文件
    if (attributes.draft && !isDev) {
        return null;
    }

    //解析文件名
    const match = basename(resolve(filename, "..")).match(PATH_REGEX);
    const novel = match[1];
    const volume = Number(match[2]);
    const name = basename(filename, ".mdz");

    //简介转换
    const firstChild = body.children[0];
    if (firstChild?.type === "element" && firstChild?.tag === "excerpt") {
        const node = firstChild.children[0];
        if (node?.type === "element" && node?.tag === "p") {
            attributes.excerpt = node.children;
            body.children.splice(0, 1);
        }
    }

    //字数统计
    let wordCount = 0;
    visit(body, "element", (node: Element) => {
        if (node.tag === "p") {
            wordCount += toString(node).length;
        }
    });

    //内容加密
    const password = String(attributes.password || "") || void 0;
    const encrypted = Boolean(password) || void 0;
    delete attributes.password;

    //日期格式化
    formatDate(attributes, ["date", "updated", "refactored"]);

    //生成映射
    let order = `[${volume}]`;
    let index = "";
    switch (processor.jMeta[novel].type) {
        case "novel": {
            const match = name.match(/^([^-]*)-(.*)$/);
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

    //写入文件
    await processor.outputJson(filename, body);

    //写入数据
    const data = {
        index,
        volume,
        encrypted,
        wordCount,
        ...attributes
    };

    //写入缓存
    return {
        name,
        order,
        novel,
        data
    };
}

//日期格式化
function formatDate(obj: Record<string, any>, keys: string[]) {
    for (const key of keys) {
        if (Reflect.has(obj, key)) {
            obj[key] = dayjs(obj[key]).format("YYYY-MM-DD");
        }
    }
}