import { compiler, emoji, image, link, maths, ruby, strikethrough } from "@bikari/article/remark";
import math from "remark-math";
import parse from "remark-parse";
import rehype, { type Options as RehypeOptions } from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import type hast from "hast";
import type mdast from "mdast";
import type { CodeToHastOptions, HighlighterCore } from "shiki";

let shiki: HighlighterCore;
let options: CodeToHastOptions;

//收集并加载语言
function code() {
    return async (tree: hast.Root) => {
        const languages: string[] = [];
        visit(tree, "code", (node: mdast.Code) => {
            languages.push(node.lang ??= "txt");
        });
        if (languages.length) {
            const shikiStore = useShikiStore();
            shiki ??= await shikiStore.load();
            options ??= shikiStore.options;
            await shikiStore.loadLang(...languages);
        }
    };
}

//代码高亮与格式转换
const rehypeOptions: RehypeOptions = {
    handlers: {
        code(state, node) {
            const hast = shiki.codeToHast(node.value, {
                ...options,
                lang: node.lang,
                meta: { __raw: node.meta },
            });
            const result: hast.Element = {
                type: "element",
                tagName: "figure",
                properties: {
                    class: "shiki",
                },
                children: [
                    {
                        type: "text",
                        value: `\`\`\`${node.lang}\n`,
                    },
                    {
                        type: "element",
                        tagName: "pre",
                        properties: {
                            class: "edge-fades-x",
                        },
                        children: hast.children as hast.ElementContent[],
                    },
                    {
                        type: "text",
                        value: "\n```",
                    },
                ],
            };
            state.patch(node, result);
            return state.applyData(node, result);
        },
        image,
        link,
        ...maths,
    },
};

export async function parseComment(text: string) {
    const processor = unified()
        .use(parse)
        .use(emoji)
        .use(math)
        .use(ruby)
        .use(strikethrough)
        .use(code)
        .use(rehype, rehypeOptions)
        .use(compiler);

    const result = await processor.process(text);
    return result.result;
}
