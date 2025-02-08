import raw from "rehype-raw";
import mdc from "remark-mdc";
import parse from "remark-parse";
import rehype, { type Options as RehypeOptions } from "remark-rehype";
import { unified } from "unified";
import code from "./handlers/code";
import image from "./handlers/image";
import link from "./handlers/link";
import compiler from "./plugins/compiler";
import emoji from "./plugins/emoji";
import footnote from "./plugins/footnote";
import frontmatter from "./plugins/frontmatter";
import interpolation from "./plugins/interpolation";
import ruby from "./plugins/ruby";
import slot from "./plugins/slot";
import slug from "./plugins/slug";
import strikethrough from "./plugins/strikethrough";
import type { Root } from "./types";

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
    text = text.replaceAll(/(?<=\n)<br\s*\/?>/g, "<p><br /></p>\n");

    const result = await processor.process(text);
    return {
        attributes: result.data.frontmatters[0] as T,
        body: result.result as Root
    };
}

export async function parseEntry<T>(text: string) {
    const processor = unified()
        .use(parse)
        .use(frontmatter, {
            type: "yaml",
            fence: "---",
            anywhere: true,
            fallthrough: true
        })
        .use(mdc)
        .use(emoji)
        .use(interpolation)
        .use(ruby)
        .use(strikethrough)
        .use(rehype, rehypeOptions)
        .use(raw)
        .use(slot);

    //文本预处理
    text = [...generateSlottedText(text)].join("");

    const result = await processor.process(text);
    const [data, ...drafts] = result.data.frontmatters as T[];

    return {
        attributes: data,
        drafts
    };
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

function* generateSlottedText(text: string) {
    let i = 0;
    let lastIndex = 0;
    for (const match of text.matchAll(/(?<=\n)---(?=\n|$)/g)) {
        const { index } = match;
        if (i % 2 === 0) {
            yield text.slice(lastIndex, index + 3);
            yield "\n\n::slots";
            lastIndex = index + 3;
        }
        else {
            yield text.slice(lastIndex, index);
            yield "::\n\n";
            lastIndex = index;
        }
        i++;
    }
    yield text.slice(lastIndex);
    yield "\n::";
}