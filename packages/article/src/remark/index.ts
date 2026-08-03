import breaks from "remark-breaks";
import math from "remark-math";
import mdc from "remark-mdc";
import parse from "remark-parse";
import rehype, { type Options as RehypeOptions } from "remark-rehype";
import { unified } from "unified";
import code from "./handlers/code.ts";
import image from "./handlers/image.ts";
import link from "./handlers/link.ts";
import maths from "./handlers/math.ts";
import compiler from "./plugins/compiler.ts";
import emoji from "./plugins/emoji.ts";
import footnote from "./plugins/footnote.ts";
import frontmatter from "./plugins/frontmatter.ts";
import hoistImage from "./plugins/hoistImage.ts";
import ruby from "./plugins/ruby.ts";
import slot from "./plugins/slot.ts";
import slug from "./plugins/slug.ts";
import strikethrough from "./plugins/strikethrough.ts";

declare module "mdast" {
  interface Node {
    attributes?: Record<string, any>;
  }
}

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
    .use(hoistImage)
    .use(math)
    .use(slug)
    .use(strikethrough)
    .use(rehype, rehypeOptions)
    .use(ruby)
    .use(compiler);

  // 文本预处理
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
    .use(hoistImage)
    .use(math)
    .use(strikethrough)
    .use(rehype, rehypeOptions)
    .use(ruby)
    .use(slot);

  // 文本预处理
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
    .use(strikethrough)
    .use(rehype, rehypeOptions)
    .use(ruby)
    .use(compiler);

  const result = await processor.process(text);
  return result.result;
}

export async function parseComment(text: string) {
  const processor = unified()
    .use(parse)
    .use(breaks)
    .use(emoji)
    .use(hoistImage)
    .use(math)
    .use(strikethrough)
    .use(rehype, rehypeOptions)
    .use(ruby)
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
