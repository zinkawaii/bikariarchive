import { compiler, iconify, image, link, ruby, strikethrough } from "@bikari/process/remark";
import parse from "remark-parse";
import rehype, { type Options as RehypeOptions } from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import type { Root } from "@bikari/process";
import type * as hast from "hast";
import type * as mdast from "mdast";

let shiki: Awaited<ReturnType<typeof getShikiHighlighter>>,
    options: Awaited<ReturnType<typeof resolveShikiOptions>>;

//收集并加载语言
function code() {
    return async (tree: hast.Root) => {
        const languages: string[] = [];
        visit(tree, "code", (node: mdast.Code) => {
            languages.push(node.lang);
        });
        if (languages.length) {
            shiki ??= await getShikiHighlighter();
            options ??= await resolveShikiOptions();
            await loadShikiLanguages(...languages);
        }
    };
}

//代码高亮与格式转换
const rehypeOptions: RehypeOptions = {
    handlers: {
        code(state, node) {
            const hast = shiki.codeToHast(node.value, {
                ...options,
                lang: node.lang
            });
            const result: hast.Element = {
                type: "element",
                tagName: "pre",
                properties: {
                    class: "shiki"
                },
                children: [
                    {
                        type: "text",
                        value: `\`\`\`${node.lang}\n`
                    },
                    ...hast.children as hast.ElementContent[],
                    {
                        type: "text",
                        value: "\n```"
                    }
                ]
            };
            state.patch(node, result);
            return state.applyData(node, result);
        },
        image,
        link
    }
};

export async function parseComment(text: string) {
    const processor = unified()
        .use(parse)
        .use(iconify)
        .use(ruby)
        .use(strikethrough)
        .use(code)
        .use(rehype, rehypeOptions)
        .use(compiler);

    const result = await processor.process(text);
    return result.result as Root;
}