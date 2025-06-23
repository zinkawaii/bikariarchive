import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "pathe";
import { createHighlighterCore, createJavaScriptRegexEngine } from "shiki";
import html from "shiki/dist/langs/html.mjs";
import light from "shiki/themes/catppuccin-latte.mjs";
import dark from "shiki/themes/one-dark-pro.mjs";

const path = resolve(import.meta.dirname, "../public/feed/style.css");
const file = await readFile(path, "utf-8");
const tokens = await getShikiTokens();
const content = replaceTokens(file, tokens);
await writeFile(path, content);

export async function getShikiTokens() {
    const shiki = await createHighlighterCore({
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

    shiki.dispose();

    return {
        ...get("light"),
        ...get("dark"),
    };

    function get(theme) {
        return {
            [`--shiki-${theme}-punctuation`]: tokens[0][0].htmlStyle[`--shiki-${theme}`],
            [`--shiki-${theme}-tag`]: tokens[0][1].htmlStyle[`--shiki-${theme}`],
            [`--shiki-${theme}-attribute-name`]: tokens[0][3].htmlStyle[`--shiki-${theme}`],
            [`--shiki-${theme}-attribute-value`]: tokens[0][5].htmlStyle[`--shiki-${theme}`],
            [`--shiki-${theme}-text`]: tokens[0][7].htmlStyle[`--shiki-${theme}`],
        };
    }
}

export function replaceTokens(content, tokens) {
    return content.replace(
        /(?<=--shiki-(light|dark)-([\w-]+):\s).*?(?=;)/g,
        (_, theme, type) => tokens[`--shiki-${theme}-${type}`],
    );
}
