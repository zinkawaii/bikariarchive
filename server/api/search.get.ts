import { readFile } from "node:fs/promises";
import { type } from "arktype";
import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";
import type { Child, Element, Root } from "@bikari/article";
import { Article } from "#shared/utils/article";
import type { GetSearchResponse } from "#server/types/api/search";

const schema = type({
    novel: "string?",
    word: "0 < string <= 64",
});

export default defineJThrottledEventHandler<GetSearchResponse>(async (event, res) => {
    const { novel, word } = schema.assert(getQuery(event));

    //连接数据库
    await connectMongoose();

    const code = word.codePointAt(0)!.toString();
    const path = r(`/.data/search/${code.slice(0, 2)}/${code}.json`);
    const data = await readFile(path, "utf-8")
        .then<Record<string, number[][]>>(JSON.parse)
        .catch(() => ({}));

    const novels = new Set(novel === void 0 ? Object.keys(Article.meta) : [novel]);
    const weakTexts = new WeakMap<Element, string>();

    //按章节遍历
    res.list = [];

    for (const [uri, vectors] of Object.entries(data)) {
        const [novel, index] = uri.split("/");
        if (!novels.has(novel)) {
            continue;
        }

        const art = Article.for(novel, index);
        const root = await readArticle(art);
        const nodes: Element[] = [];

        for (const vector of vectors) {
            let node: Root | Child = root;
            for (let i = 0; i < vector.length - 1; i++) {
                if (node.type === "text") {
                    break;
                }
                node = node.children[vector[i]];
            }

            if (node.type !== "element" || node.tag !== "p") {
                continue;
            }

            let text = weakTexts.get(node);
            if (text === void 0) {
                weakTexts.set(node, text = toString(node));
            }

            if (text.startsWith(word, vector.at(-1))) {
                nodes.push(node);
            }
        }

        if (!nodes.length) {
            continue;
        }

        const paragraphs: Element[] = [];
        visit(root, "element", (node) => {
            if (node.tag === "p") {
                paragraphs.push(node);
            }
        });

        const line = paragraphs.findIndex((p) => p === nodes[0]);
        const start = Math.max(line - 1, 0);
        const end = Math.min(line + 2, paragraphs.length);

        res.list.push({
            novel: art.novel,
            index: art.index,
            count: nodes.length,
            parts: Array.from({ length: end - start }, (_, i) => paragraphs[i + start]),
        });
    }
}, 1500);
