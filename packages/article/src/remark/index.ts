import { setProperty } from "propathy";
import raw from "rehype-raw";
import frontmatter from "remark-frontmatter";
import mdc from "remark-mdc";
import parse from "remark-parse";
import rehype, { type Options as RehypeOptions } from "remark-rehype";
import { unified } from "unified";
import code from "./handlers/code";
import image from "./handlers/image";
import link from "./handlers/link";
import attributes from "./plugins/attributes";
import compiler from "./plugins/compiler";
import emoji from "./plugins/emoji";
import footnote from "./plugins/footnote";
import interpolation from "./plugins/interpolation";
import ruby from "./plugins/ruby";
import slot from "./plugins/slot";
import slug from "./plugins/slug";
import strikethrough from "./plugins/strikethrough";
import type { Element, Root } from "./types";

export {
    compiler,
    emoji,
    image,
    link,
    ruby,
    strikethrough
};

const rehypeOptions: RehypeOptions = {
    allowDangerousHtml: true,
    footnoteLabel: "参考资料",
    handlers: {
        code,
        image,
        link
    }
};

export async function parseArticle<T>(text: string) {
    const processor = unified()
        .use(parse)
        .use(frontmatter)
        .use(attributes)
        .use(mdc)
        .use(emoji)
        .use(footnote)
        .use(interpolation)
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
        .use(emoji)
        .use(interpolation)
        .use(ruby)
        .use(strikethrough)
        .use(rehype, rehypeOptions)
        .use(raw)
        .use(slot);

    //文本预处理
    text = text.replace(/(?<=\n)---/, "---\n\n::slots") + "\n\n::";

    const result = await processor.process(text);
    const { data } = result;

    const slots = (result.result as Root).children as Element[];
    for (const slot of slots) {
        const path = slot.tag;
        const content = slot.children;
        setProperty(data, path, content);
    }
    return data as T;
}

export async function parseUpdate(text: string) {
    const processor = unified()
        .use(parse)
        .use(emoji)
        .use(ruby)
        .use(strikethrough)
        .use(rehype, rehypeOptions)
        .use(raw)
        .use(compiler);

    const result = await processor.process(text);
    return result.result as Root;
}