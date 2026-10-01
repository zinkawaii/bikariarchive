import { addServerHandler, addTemplate, createResolver, defineNuxtModule } from "nuxt/kit";
import { createHighlighterCore, createJavaScriptRegexEngine } from "shiki";
import html from "shiki/dist/langs/html.mjs";
import light from "shiki/themes/catppuccin-latte.mjs";
import dark from "shiki/themes/one-dark-pro.mjs";

export default defineNuxtModule({
  meta: {
    name: "@bikari/feed",
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    const isCustomElement = nuxt.options.vue.compilerOptions.isCustomElement;
    nuxt.options.vue.compilerOptions.isCustomElement = (tag) => isCustomElement?.(tag) || tag.startsWith("xsl:");

    addServerHandler({
      route: "/feed",
      handler: resolver.resolve("runtime/server/feed.get"),
    });

    addServerHandler({
      route: "/feed/template.xsl",
      handler: resolver.resolve("runtime/server/template.get"),
    });

    const tokens = await getShikiTokens();
    addTemplate({
      filename: "feed.mjs",
      write: true,
      getContents: () => `
export const variables = /* CSS */\`
:root {
${Object.entries(tokens.light).map(([key, value]) => `  ${key}: ${value};`).join("\n")}
  @media (prefers-color-scheme: dark) {
${Object.entries(tokens.dark).map(([key, value]) => `    ${key}: ${value};`).join("\n")}
  }
  color-scheme: light dark;
}
\`;
`.trimStart(),
    });
  },
});

export async function getShikiTokens() {
  using shiki = await createHighlighterCore({
    engine: createJavaScriptRegexEngine(),
    langs: [
      html,
    ],
  });

  const { tokens } = shiki.codeToTokens(`<div class="foo">bar</div>`, {
    themes: {
      light,
      dark,
    },
    lang: "html",
    defaultColor: false,
  });

  return {
    light: get("light"),
    dark: get("dark"),
  };

  function get(theme: string) {
    return {
      [`--shiki-punctuation`]: tokens[0][0].htmlStyle![`--shiki-${theme}`],
      [`--shiki-tag`]: tokens[0][1].htmlStyle![`--shiki-${theme}`],
      [`--shiki-attribute-name`]: tokens[0][3].htmlStyle![`--shiki-${theme}`],
      [`--shiki-attribute-value`]: tokens[0][5].htmlStyle![`--shiki-${theme}`],
      [`--shiki-text`]: tokens[0][7].htmlStyle![`--shiki-${theme}`],
    };
  }
}
