import { createPlainShiki, type MountPlainShikiOptions, type MountPlainShikiReturns, type PlainShiki } from "plain-shiki";
import type { BundledLanguage, BundledTheme } from "shiki";

export type UsePlainShikiOptions = Omit<MountPlainShikiOptions, "lang" | "themes"> & {
    lang: MaybeRefOrGetter<BundledLanguage>;
    themes: MaybeRefOrGetter<Record<string, BundledTheme>>;
};

export function usePlainShiki(
    el: MaybeRefOrGetter<HTMLElement | null | undefined>,
    options: MountPlainShikiOptions,
) {
    const target = toRef(el);
    const lang = toRef(options.lang);
    const themes = toRef(options.themes);

    let plain: PlainShiki;
    let ctx: MountPlainShikiReturns;

    const { trigger } = watchTriggerable([target, lang, themes], async () => {
        await loadShikiLanguages(lang.value);
        const shikiOptions = await resolveShikiOptions();
        ctx?.dispose();

        if (target.value) {
            ctx = plain?.mount(target.value, {
                ...shikiOptions,
                ...options,
            });
        }
    });

    onMounted(async () => {
        const shiki = await getShikiHighlighter();
        plain = createPlainShiki(shiki);
        trigger();
    });

    onUnmounted(() => {
        ctx?.dispose();
    });
}
