import { setProperty } from "dot-prop";
import { unified } from "unified";
import $ from "node-html-parser";
import parse from "remark-parse";
import frontmatter from "remark-frontmatter";
import externalLinks, { type Options as ExternalOptions } from "rehype-external-links";
import gfm from "remark-gfm";
import mdc from "remark-mdc";
import rehype from "remark-rehype";
import raw from "rehype-raw";
import stringify from "rehype-stringify";
import attributes from "./plugins/attributes";
import ruby from "./plugins/ruby";
import slot from "./plugins/slot";
import codeHandler from "./handlers/code";

const externalOptions: ExternalOptions = {
    rel: ["noopener", "noreferrer", "nofollow"],
    target: "_blank"
};

const rehypeOptions = {
    allowDangerousHtml: true,
    handlers: {
        code: codeHandler
    }
};

export async function parseArticle<T>(text: string) {
    const processor = unified()
        .use(parse)
        .use(frontmatter)
        .use(attributes)
        .use(gfm)
        .use(mdc)
        .use(ruby)
        .use(externalLinks, externalOptions)
        .use(rehype, rehypeOptions)
        .use(raw)
        .use(stringify);

    const result = await processor.process(text);
    return {
        attributes: result.data as T,
        content: result.value.toString()
    };
}

export async function parseEntry(text: string) {
    const processor = unified()
        .use(parse)
        .use(frontmatter)
        .use(attributes)
        .use(gfm)
        .use(ruby)
        .use(slot)
        .use(externalLinks, externalOptions)
        .use(rehype, rehypeOptions)
        .use(raw)
        .use(stringify);

    const result = await processor.process(text);
    const { data } = result;

    const doc = $.parse(result.value.toString());
    const slots = doc.querySelectorAll("slot");
    for (const slot of slots) {
        const path = slot.getAttribute("path");
        const content = slot.innerHTML;
        setProperty(data, path, content);
    }
    return data;
}