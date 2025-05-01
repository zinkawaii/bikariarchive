import { isDev } from "@bikari/shared";
import { format } from "date-fns";
import fs from "fs-extra";
import { createProcessor, type LoadInfo, type SourceInfo, useLoad, useSource } from "kerria";
import { toString } from "mdast-util-to-string";
import { basename, resolve } from "pathe";
import { visit } from "unist-util-visit";
import { parseArticle, parseEntry } from "../remark";
import type { ArticleFrontmatter, NovelFrontmatter } from "./types";

enum SourceKind {
    Meta,
    Article,
}

const PATH_REGEX = /^(.*?)\.(\d+)$/;

export default createProcessor("Article", () => {
    const metaInfo = useLoad("meta", {
        out: "dist/json/Article.json",
        beforeOutput(val) {
            const newVal = sortKeyValues<any>(
                structuredClone(val),
                ({ order: a }, { order: b }) => a.localeCompare(b),
            );
            for (const novel in newVal) {
                delete newVal[novel].order;
                newVal[novel].chapters = Object.entries(newVal[novel].chapters)
                    .toSorted(([a], [b]) => a.localeCompare(b))
                    .map(([_, c]) => c);
            }
            return newVal;
        },
    });

    const mapInfo = useLoad("map", {
        out: "dist/json/Artmap.json",
    });

    useSource(SourceKind.Meta, {
        base: "data",
        folders: [
            "novel",
        ],
        ext: ".mdz",
        deep: false,
        parse(path) {
            return processMeta(path);
        },
        unlink(cache) {
            const { novel } = cache;

            delete mapInfo.value[novel];
            delete metaInfo.value[novel];
        },
        onCacheHit(cache) {
            const { novel, order, data } = cache;

            if (!(novel in metaInfo.value)) {
                mapInfo.value[novel] = {};
                metaInfo.value[novel] = {
                    order,
                    chapters: [],
                };
            }
            Object.assign(metaInfo.value[novel], data);
        },
    });

    useSource(SourceKind.Article, {
        base: "data",
        dist: "dist",
        folders: [
            "novel",
        ],
        ext: ".mdz",
        skip: 1,
        parse(path, info) {
            return processArticle(path, info, metaInfo);
        },
        unlink(cache) {
            const { order, novel, data } = cache;
            const { index } = data;

            delete mapInfo.value[novel][index];
            delete metaInfo.value[novel].chapters[order];
        },
        onCacheHit(cache) {
            const { order, name, novel, data } = cache;
            const { index, password } = data;

            metaInfo.value[novel].chapters[order] = data;
            mapInfo.value[novel][index] = {
                name,
                password,
            };
        },
    });
});

async function processMeta(path: string) {
    //处理文件
    const file = await fs.readFile(path);
    const { attributes } = await parseEntry<NovelFrontmatter>(file.toString());
    const [order, novel] = basename(path, ".mdz").split("-");

    //写入缓存
    return {
        novel,
        order,
        data: attributes,
    };
}

async function processArticle(path: string, info: SourceInfo, metaInfo: LoadInfo) {
    //处理文件
    const file = await fs.readFile(path);
    const { attributes, body } = await parseArticle<ArticleFrontmatter>(file.toString());

    //生产环境下忽略草稿文件
    if (attributes.draft && !isDev) {
        return null;
    }

    //解析文件名
    const match = basename(resolve(path, "..")).match(PATH_REGEX);
    const novel = match[1];
    const volume = Number(match[2]);
    const name = basename(path, ".mdz");

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
    visit(body, "element", (node) => {
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
    switch (metaInfo.value[novel].type) {
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
    await info.output(path, body);

    //写入数据
    const data = {
        index,
        volume,
        encrypted,
        wordCount,
        ...attributes,
    };

    //写入缓存
    return {
        name,
        order,
        novel,
        data,
    };
}

//键值对排序
function sortKeyValues<T>(obj: Record<string, T>, compareFn: (a: T, b: T) => number) {
    return Object.fromEntries(
        Object.entries(obj)
            .toSorted(([, a], [, b]) => compareFn(a, b)),
    );
}

//日期格式化
function formatDate(obj: Record<string, any>, keys: string[]) {
    for (const key of keys) {
        if (key in obj) {
            obj[key] = format(obj[key], "yyyy-MM-dd");
        }
    }
}
