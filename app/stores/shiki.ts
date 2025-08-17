import type { BundledLanguage, CodeToHastOptions, HighlighterCore, ShikiTransformer } from "shiki";

export const useShikiStore = defineStore("shiki", () => {
    let promise: Promise<HighlighterCore>;
    let shiki: HighlighterCore;

    const options: CodeToHastOptions<BundledLanguage, any> = {
        lang: "javascript",
        themes: {
            light: "catppuccin-latte",
            dark: "one-dark-pro",
        },
        defaultColor: false,
        transformers: [
            transformerRenderIndentGuides(),
            {
                root: (root) => ({
                    type: "root",
                    children: (root.children[0] as any).children[0].children,
                }),
            },
        ],
    };

    async function load() {
        promise ??= loadShiki();
        shiki ??= await promise;
        return shiki;
    }

    async function loadShiki() {
        const [
            { createHighlighterCore },
            { createJavaScriptRegexEngine },
            light,
            dark,
        ] = await Promise.all([
            import("shiki/core"),
            import("shiki/engine-javascript.mjs"),
            import("shiki/themes/catppuccin-latte.mjs"),
            import("shiki/themes/one-dark-pro.mjs"),
        ]);

        return await createHighlighterCore({
            engine: createJavaScriptRegexEngine(),
            themes: [light, dark],
        });
    }

    async function loadLang(...langs: string[]) {
        const { bundledLanguages } = await import("shiki/langs");
        const loadedLanguages = shiki.getLoadedLanguages();
        await Promise.all(
            langs
                .filter((lang) => !loadedLanguages.includes(lang) && lang in bundledLanguages)
                .map((lang) => bundledLanguages[lang as BundledLanguage])
                .map((dynamicLang) => dynamicLang().then((loadedLang) => shiki.loadLanguage(loadedLang))),
        );
    }

    return {
        options,
        load,
        loadLang,
    };
});

function transformerRenderIndentGuides(options: {
    indent?: number;
} = {}): ShikiTransformer {
    return {
        name: "render-indent-guides",
        code(hast) {
            let { indent = 2 } = options;

            const match = this.options.meta?.__raw?.match(/\{indent:(\d+|false)\}/);
            if (match) {
                if (match[1] === "false") {
                    return hast;
                }
                indent = Number(match[1]);
            }
            const indentRE = new RegExp(` {${indent}}| {0,${indent - 1}}\t| {1,}$`, "g");

            const emptyLines: [import("hast").Element, number][] = [];
            let level = 0;

            for (const line of hast.children) {
                if (line.type !== "element") {
                    continue;
                }

                const first = line.children[0];
                if (first?.type !== "element" || first?.children[0]?.type !== "text") {
                    emptyLines.push([line, level]);
                    continue;
                }

                const text = first.children[0];
                const leading = text.value.split(/[^ \t]/, 1)[0];

                const ranges: [number, number][] = [];
                for (const match of leading.matchAll(indentRE)) {
                    const start = match.index;
                    const end = start + match[0].length;
                    ranges.push([start, end]);
                }

                for (const [line, level] of emptyLines) {
                    line.children.unshift(...Array.from({ length: Math.min(ranges.length, level + 1) }, (_, i) => ({
                        type: "element",
                        tagName: "span",
                        properties: {
                            class: "indent",
                            style: `--indent-offset: ${i * indent}ch;`,
                        },
                        children: [],
                    } satisfies import("hast").Element)));
                }
                emptyLines.length = 0;
                level = ranges.length;

                if (ranges.length) {
                    line.children.unshift(
                        ...ranges.map(([start, end]) => ({
                            type: "element",
                            tagName: "span",
                            properties: {
                                class: "indent",
                            },
                            children: [{
                                type: "text",
                                value: text.value.slice(start, end),
                            }],
                        } satisfies import("hast").Element)),
                    );
                    text.value = text.value.slice(ranges.at(-1)![1]);
                }
            }
            return hast;
        },
    };
}
