import { transformerRenderIndentGuides } from "@shikijs/transformers";
import type { BundledLanguage, CodeToHastOptions, HighlighterCore } from "shiki";

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

    onUnmounted(() => {
        promise?.then((shiki) => shiki.dispose());
    });

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
        // @ts-expect-error https://typescript.tv/errors/#ts2307
        const { bundledLanguages } = await import("https://esm.sh/shiki/langs") as typeof import("shiki/langs");
        const loadedLanguages = shiki.getLoadedLanguages();
        await Promise.all(
            langs
                .filter((lang) => !loadedLanguages.includes(lang))
                .map((lang) => bundledLanguages[lang as BundledLanguage]?.().then(shiki.loadLanguage)),
        );
    }

    return {
        options,
        load,
        loadLang,
    };
});
