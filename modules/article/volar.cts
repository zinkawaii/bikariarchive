import type { Code, VueLanguagePlugin } from "@vue/language-core";

const interpolationRE = /\{\{(?<exp>[^}]*)\}\}/g;

const plugin: VueLanguagePlugin = ({ modules }) => [{
  version: 2.2,
  getEmbeddedCodes(fileName, ir) {
    const embeddedCodes = [];
    for (let i = 0; i < ir.customBlocks.length; i++) {
      const block = ir.customBlocks[i];
      if (block.type === "article") {
        embeddedCodes.push({
          id: `${block.type}_${i}`,
          lang: block.lang,
        });
      }
    }
    return embeddedCodes;
  },
  resolveEmbeddedCode(fileName, ir, embeddedFile) {
    if (!embeddedFile.id.startsWith("article_")) {
      return;
    }

    const index = Number.parseInt(embeddedFile.id.split("_")[1]);
    const block = ir.customBlocks[index];

    embeddedFile.content.push([
      block.content,
      block.name,
      0,
      modules["@vue/language-core"].codeFeatures.full,
    ]);
  },
}, {
  version: 2.2,
  resolveEmbeddedCode(fileName, ir, embeddedFile) {
    if (!embeddedFile.id.startsWith("script_")) {
      return;
    }

    const blocks = ir.customBlocks.filter((block) => block.type === "article");
    if (!blocks.length) {
      return;
    }

    for (const block of blocks) {
      for (const match of block.content.matchAll(interpolationRE)) {
        embeddedFile.content.push(`__VLS_ctx.`, [
          match.groups!.exp,
          block.name,
          match.index! + "{{".length,
          modules["@vue/language-core"].codeFeatures.full,
        ], `;\n`);
      }
    }

    const articles = blocks.map((block) => {
      const name = block.attrs.name;
      return typeof name === "string" ? name : "default";
    });

    augmentContext(embeddedFile.content, [
      `{} as { $articles: Record<${
        articles.map((article) => `"${article}"`).join(" | ")
      }, import("@bikari/article").Child[]> }`,
    ]);
  },
}];

module.exports = plugin;

function augmentContext(content: Code[], codes: Code[]) {
  let from = -1;

  for (let i = 0; i < content.length; i++) {
    const code = content[i];
    if (typeof code !== "string") {
      continue;
    }

    if (from === -1) {
      if (code.startsWith(`const __VLS_ctx`)) {
        from = i;
      }
      continue;
    }

    if (code === `}`) {
      content.splice(i, 0, ...codes.map((code) => `...${code},\n`));
      break;
    }
    else if (code === `;\n`) {
      content.splice(
        from + 1,
        i - from,
        `{\n`,
        `...`,
        ...content.slice(from + 1, i),
        `,\n`,
        ...codes.map((code) => `...${code},\n`),
        `}`,
        `;\n`,
      );
      break;
    }
  }
}
