import parse from "remark-parse";
import gfm from "remark-gfm";
import rehype, { type Options as RehypeOptions } from "remark-rehype";
import externalLinks, { type Options as ExternalOptions } from "rehype-external-links";
import stringify from "rehype-stringify";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import type { Code } from "mdast";
import type { Element, Root } from "hast";

let shiki: Awaited<ReturnType<typeof getShikiHighlighter>>,
    options: Awaited<ReturnType<typeof resolveShikiOptions>>;

//收集并加载语言
const code = () => async (tree: Root) => {
    const languages: string[] = [];
    visit(tree, "code", (node: Code) => {
        languages.push(node.lang);
    });
    if (languages.length) {
        shiki ??= await getShikiHighlighter();
        options ??= await resolveShikiOptions(highlightOptions);
        await loadShikiLanguages(...languages);
    }
};

//代码高亮与格式转换
const rehypeOptions: RehypeOptions = {
    handlers: {
        code(state, node) {
            const hast = shiki.codeToHast(node.value, {
                ...options,
                lang: node.lang
            }) as any;
            const result: Element = {
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
                    hast,
                    {
                        type: "text",
                        value: "\n```"
                    }
                ]
            };
            state.patch(node, result);
            return state.applyData(node, result);
        }
    }
};

const externalOptions: ExternalOptions = {
    rel: ["noopener", "noreferrer", "nofollow"],
    target: "_blank",
    properties: {
        class: "plain-link"
    }
};

async function parseComment(text: string) {
    const processor = unified()
        .use(parse)
        .use(gfm)
        .use(code)
        .use(rehype, rehypeOptions)
        .use(externalLinks, externalOptions)
        .use(stringify);

    const result = await processor.process(text);
    return result.value.toString();
}

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive("remark", async (el, binding) => {
        el.innerHTML = `<p class="sanitized">好像说了什么，但是被清除了</p>`;

        const html = await parseComment(binding.value);
        if (html.length) {
            el.innerHTML = html;
        }
    });
});