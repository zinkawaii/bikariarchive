import { setProperty } from "dot-prop";
import { unified } from "unified";
import parse from "remark-parse";
import frontmatter from "remark-frontmatter";
import mdc from "remark-mdc";
import rehype, { type Options as RehypeOptions } from "remark-rehype";
import raw from "rehype-raw";
import type { Root } from "../types";
import attributes from "./plugins/attributes";
import compiler from "./plugins/compiler";
import footnote from "./plugins/footnote";
import ruby from "./plugins/ruby";
import slot from "./plugins/slot";
import slug from "./plugins/slug";
import strikethrough from "./plugins/strikethrough";
import code from "./handlers/code";
import link from "./handlers/link";

export {
    compiler,
    link,
    ruby,
    strikethrough
};

const rehypeOptions: RehypeOptions = {
    allowDangerousHtml: true,
    footnoteLabel: "参考资料",
    handlers: {
        code,
        link
    }
};

export async function parseArticle<T>(text: string) {
    const processor = unified()
        .use(parse)
        .use(frontmatter)
        .use(attributes)
        .use(mdc)
        .use(footnote)
        .use(ruby)
        .use(slug)
        .use(strikethrough)
        .use(rehype, rehypeOptions)
        .use(raw)
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
        .use(mdc)
        .use(footnote)
        .use(ruby)
        .use(strikethrough)
        .use(rehype, rehypeOptions)
        .use(raw)
        .use(slot);

    //文本预处理
    text = text.replace(/(?<=\n)---/, "---\n\n::slots") + "\n\n::";

    const result = await processor.process(text);
    const { data } = result;

    const slots = (result.result as Root).children;
    for (const slot of slots) {
        const path = slot.tag;
        const content = slot.children;
        setProperty(data, path, content);
    }
    return data as T;
}