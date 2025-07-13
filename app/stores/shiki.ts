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
        transformers: [{
            root: (hast) => ({
                type: "root",
                children: (hast.children[0] as any).children[0].children,
            }),
        }],
    };

    onMounted(() => {
        shiki?.dispose();
    });

    async function load() {
        promise ??= loadShiki();
        shiki ??= await promise;
        return shiki;
    }

    async function loadShiki() {
        const { createHighlighterCore } = await import("shiki/core");
        const { createJavaScriptRegexEngine } = await import("shiki/engine-javascript.mjs");

        return await createHighlighterCore({
            engine: createJavaScriptRegexEngine(),
            themes: [
                await import("shiki/themes/catppuccin-latte.mjs"),
                await import("shiki/themes/one-dark-pro.mjs"),
            ],
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
