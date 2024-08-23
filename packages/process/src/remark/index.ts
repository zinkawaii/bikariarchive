import { setProperty } from "dot-prop";
import { unified } from "unified";
import $ from "node-html-parser";
import parse from "remark-parse";
import frontmatter from "remark-frontmatter";
import rehype, { type Options as RehypeOptions } from "remark-rehype";
import raw from "rehype-raw";
import externalLinks, { type Options as ExternalOptions } from "rehype-external-links";
import stringify from "rehype-stringify";
import type { Root } from "../types";
import attributes from "./plugins/attributes";
import compiler from "./plugins/compiler";
import footnote from "./plugins/footnote";
import ruby from "./plugins/ruby";
import slot from "./plugins/slot";
import slug from "./plugins/slug";
import strikethrough from "./plugins/strikethrough";
import code from "./handlers/code";

export {
    ruby,
    strikethrough
};

const externalOptions: ExternalOptions = {
    rel: ["noopener", "noreferrer", "nofollow"],
    target: "_blank",
    properties: {
        class: "plain-link"
    }
};

const rehypeOptions: RehypeOptions = {
    allowDangerousHtml: true,
    footnoteLabel: "参考资料",
    handlers: {
        code
    }
};

export async function parseArticle<T>(text: string) {
    const processor = unified()
        .use(parse)
        .use(frontmatter)
        .use(attributes)
        .use(footnote)
        .use(ruby)
        .use(slug)
        .use(strikethrough)
        .use(rehype, rehypeOptions)
        .use(raw)
        .use(externalLinks, externalOptions)
        .use(compiler);

    //文本预处理
    text = text.replaceAll(/(?<=\n)<br(\s*)\/?>/g, "<p><br /></p>\n");

    const result = await processor.process(text);
    return {
        attributes: result.data as T,
        body: result.result as Root
    };
}

export async function parseEntry<T>(text: string) {
    const processor = unified()
        .use(parse)
        .use(frontmatter)
        .use(attributes)
        .use(footnote)
        .use(ruby)
        .use(strikethrough)
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