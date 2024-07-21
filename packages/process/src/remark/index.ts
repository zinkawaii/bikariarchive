import { setProperty } from "dot-prop";
import { unified } from "unified";
import $ from "node-html-parser";
import parse from "remark-parse";
import frontmatter from "remark-frontmatter";
import gfm from "remark-gfm";
import mdc from "remark-mdc";
import rehype, { type Options as RehypeOptions } from "remark-rehype";
import raw from "rehype-raw";
import slug from "rehype-slug";
import externalLinks, { type Options as ExternalOptions } from "rehype-external-links";
import stringify from "rehype-stringify";
import attributes from "./plugins/attributes";
import ruby from "./plugins/ruby";
import slot from "./plugins/slot";
import code from "./handlers/code";

const externalOptions: ExternalOptions = {
    rel: ["noopener", "noreferrer", "nofollow"],
    target: "_blank",
    properties: {
        class: "plain-link"
    }
};

const rehypeOptions: RehypeOptions = {
    allowDangerousHtml: true,
    handlers: {
        code
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
        .use(rehype, rehypeOptions)
        .use(raw)
        .use(slug)
        .use(externalLinks, externalOptions)
        .use(stringify);

    //文本预处理
    text = text.replaceAll(/(?<=\n)<br(\s*)\/?>/g, "<p><br /></p>\n");

    const result = await processor.process(text);
    return {
        attributes: result.data as T,
        content: result.value.toString()
    };
}

export async function parseEntry<T>(text: string) {
    const processor = unified()
        .use(parse)
        .use(frontmatter)
        .use(attributes)
        .use(gfm)
        .use(ruby)
        .use(slot)
        .use(rehype, rehypeOptions)
        .use(raw)
        .use(externalLinks, externalOptions)
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
    return data as T;
}