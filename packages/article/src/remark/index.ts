import breaks from "remark-breaks";
import math from "remark-math";
import mdc from "remark-mdc";
import parse from "remark-parse";
import rehype, { type Options as RehypeOptions } from "remark-rehype";
import { unified } from "unified";
import code from "./handlers/code";
import image from "./handlers/image";
import link from "./handlers/link";
import maths from "./handlers/math";
import compiler from "./plugins/compiler";
import emoji from "./plugins/emoji";
import footnote from "./plugins/footnote";
import frontmatter from "./plugins/frontmatter";
import ruby from "./plugins/ruby";
import slot from "./plugins/slot";
import slug from "./plugins/slug";
import strikethrough from "./plugins/strikethrough";

const rehypeOptions: RehypeOptions = {
    allowDangerousHtml: true,
    footnoteLabel: "参考资料",
    handlers: {
        code,
        image,
        link,
        ...maths,
    },
};

export async function parseArticle<T>(text: string) {
    const processor = unified()
        .use(parse)
        .use(frontmatter)
        .use(mdc)
        .use(emoji)
        .use(footnote)
        .use(math)
        .use(ruby)
        .use(slug)
        .use(strikethrough)
        .use(rehype, rehypeOptions)
        .use(compiler);

    //文本预处理
    text = text.replaceAll(/(?<=\n)<br\s*\/?>/g, "::p\n:br\n::");

    const result = await processor.process(text);
    return {
        attributes: result.data.frontmatters![0] as T,
        body: result.result,
    };
}

export async function parseEntry<T>(text: string) {
    const processor = unified()
        .use(parse)
        .use(frontmatter, {
            type: "yaml",
            fence: "---",
            anywhere: true,
            fallthrough: true,
        })
        .use(mdc)
        .use(emoji)
        .use(math)
        .use(ruby)
        .use(strikethrough)
        .use(rehype, rehypeOptions)
        .use(slot);

    //文本预处理
    text = generateSlottedText(text);

    const result = await processor.process(text);
    const [attributes, ...drafts] = result.data.frontmatters as T[];

    return {
        attributes,
        drafts,
    };
}

export async function parseUpdate(text: string) {
    const processor = unified()
        .use(parse)
        .use(mdc)
        .use(emoji)
        .use(ruby)
        .use(strikethrough)
        .use(rehype, rehypeOptions)
        .use(compiler);

    const result = await processor.process(text);
    return result.result;
}

export async function parseComment(text: string) {
    const processor = unified()
        .use(parse)
        .use(breaks)
        .use(emoji)
        .use(math)
        .use(ruby)
        .use(strikethrough)
        .use(rehype, rehypeOptions)
        .use(compiler);

    const result = await processor.process(text);
    return result.result;
}

function generateSlottedText(source: string) {
    const start = source.match(/(?<=\n---\n)/)?.index ?? 0;
    let text = "";

    text += source.slice(0, start);
    text += `\n::slots\n`;

    const match = source.match(/^::draft\n(---[\s\S]*?\n---)/m);
    if (match) {
        text += source.slice(start, match.index);
        text += "::\n\n";
        text += match[1];
        text += "\n\n::slots";
        text += source.slice(match.index! + match[0].length);
    }
    else {
        text += source.slice(start);
        text += "\n::";
    }

    return text.replaceAll(/(?<=\n#) \b/g, "");
}
