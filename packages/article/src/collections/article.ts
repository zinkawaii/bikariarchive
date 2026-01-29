import { readFile } from "node:fs/promises";
import { format } from "date-fns";
import { createKerria, useLoad, useSource } from "kerria";
import { toString } from "mdast-util-to-string";
import { basename, resolve } from "pathe";
import { visit } from "unist-util-visit";
import { parseArticle, parseEntry } from "../remark";
import { isDevelopment } from "../utils";
import type { ArticleFrontmatter, NovelFrontmatter } from "../types/article";

enum SourceKind {
    Meta,
    Article,
}

export default createKerria("Article", () => {
    const metaInfo = useLoad("meta", {
        out: ".data/json/Article.json",
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
        out: ".data/json/Artmap.json",
    });

    useSource(SourceKind.Meta, {
        base: "content",
        folders: [
            "novel",
        ],
        ext: ".mdz",
        deep: false,
        async parse(path) {
            //处理文件
            const file = await readFile(path, "utf-8");
            const { attributes } = await parseEntry<NovelFrontmatter>(file);
            const [order, novel] = basename(path, ".mdz").split("-");

            //写入缓存
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

    useSource(SourceKind.Article, {
        base: "content",
        dist: ".data",
        folders: [
            "novel",
        ],
        ext: ".mdz",
        skip: 1,
        async parse(path, info) {
            //处理文件
            const file = await readFile(path, "utf-8");
            const { attributes, body } = await parseArticle<ArticleFrontmatter>(file);

            //生产环境下忽略草稿文件
            if (attributes.draft && !isDevelopment) {
                return null;
            }

            //解析文件名
            const match = basename(resolve(path, "..")).match(/^(.*?)\.(\d+)$/)!;
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
            for (const [key, value] of Object.entries(attributes.date ?? {})) {
                Reflect.set(attributes.date!, key, format(value, "yyyy-MM-dd"));
            }

            //生成映射
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
                password,
                data,
            };
        },
        cache(cache) {
            const { order, name, novel, password, data } = cache;
            const { index } = data;

            metaInfo.value[novel].chapters[order] = data;
            mapInfo.value[novel][index] = {
                name,
                password,
            };
        },
        unlink(cache) {
            const { order, novel, data } = cache;
            const { index } = data;

            delete mapInfo.value[novel][index];
            delete metaInfo.value[novel].chapters[order];
        },
    });
});
