import breaks from "remark-breaks";
import rehype, { type Options as RehypeOptions } from "remark-rehype";
import { createParser } from "satorigear";
import { unified } from "unified";
import code from "./handlers/code.ts";
import component from "./handlers/component.ts";
import image from "./handlers/image.ts";
import link from "./handlers/link.ts";
import { inlineMath, math } from "./handlers/math.ts";
import compiler from "./plugins/compiler.ts";
import emoji from "./plugins/emoji.ts";
import frontmatter from "./plugins/frontmatter.ts";
import hoistImage from "./plugins/hoistImage.ts";
import ruby from "./plugins/ruby.ts";
import slot from "./plugins/slot.ts";
import slug from "./plugins/slug.ts";

const rehypeOptions: RehypeOptions = {
  allowDangerousHtml: true,
  footnoteLabel: "参考资料",
  handlers: {
    blockComponent: component,
    inlineComponent: component,
    code,
    image,
    link,
    math,
    inlineMath,
  },
};

const parserArticle = createParser({
  features: {
    attributes: true,
    binding: true,
    component: true,
    footnote: true,
    frontmatter: true,
    math: true,
    strikethrough: true,
    table: true,
  },
});

const processorArticle = unified()
  .use(function() {
    this.parser = (document) => parserArticle.parse(document);
  })
  .use(frontmatter)
  .use(emoji)
  .use(hoistImage)
  .use(ruby)
  .use(slug)
  .use(rehype, rehypeOptions)
  .use(compiler);

export async function parseArticle<T>(text: string) {
  // 文本预处理
  text = text.replaceAll(/(?<=\n)<br\s*\/?>/g, "::p\n:br\n::");

  const result = await processorArticle.process(text);
  const attributes = result.data.frontmatters?.[0] ?? {};

  return {
    attributes: attributes as T,
    body: result.result,
  };
}

const parserEntry = createParser({
  features: {
    attributes: true,
    component: true,
    frontmatter: true,
    math: true,
    strikethrough: true,
    table: true,
  },
});

const processorEntry = unified()
  .use(function() {
    this.parser = (document) => parserEntry.parse(document);
  })
  .use(frontmatter)
  .use(emoji)
  .use(hoistImage)
  .use(ruby)
  .use(rehype, rehypeOptions)
  .use(slot);

export async function parseEntry<T>(text: string) {
  // 文本预处理
  text = generateSlottedText(text);

  const result = await processorEntry.process(text);
  const [attributes, ...drafts] = result.data.frontmatters as T[];

  return {
    attributes,
    drafts,
  };
}

const parserUpdate = createParser({
  features: {
    attributes: true,
    component: true,
    strikethrough: true,
  },
});

const processorUpdate = unified()
  .use(function() {
    this.parser = (document) => parserUpdate.parse(document);
  })
  .use(emoji)
  .use(ruby)
  .use(rehype, rehypeOptions)
  .use(compiler);

export async function parseUpdate(text: string) {
  const result = await processorUpdate.process(text);
  return result.result;
}

const parserComment = createParser({
  features: {
    attributes: true,
    component: true,
    strikethrough: true,
  },
});

const processorComment = unified()
  .use(function() {
    this.parser = (document) => parserComment.parse(document);
  })
  .use(breaks)
  .use(emoji)
  .use(hoistImage)
  .use(ruby)
  .use(rehype, rehypeOptions)
  .use(compiler);

export async function parseComment(text: string) {
  const result = await processorComment.process(text);
  return result.result;
}

function generateSlottedText(source: string) {
  let text = `::slots\n`;

  const match = source.match(/(?=^::draft$)/m);
  if (match) {
    text += source.slice(0, match.index);
    text += "::\n\n";
    text += source.slice(match.index! + match[0].length);
  }
  else {
    text += source;
    text += "\n::\n";
  }

  return text.replaceAll(/(?<=\n#) \b(.*)/g, (match, name) => (
    name.replaceAll("[", ".").replaceAll("]", "")
  ));
}
