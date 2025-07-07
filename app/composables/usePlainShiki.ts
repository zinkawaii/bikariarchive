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

    const shikiStore = useShikiStore();

    let plain: PlainShiki;
    let ctx: MountPlainShikiReturns;

    const { trigger } = watchTriggerable([target, lang, themes], async () => {
        await shikiStore.language(lang.value);
        ctx?.dispose();

        if (target.value) {
            ctx = plain?.mount(target.value, {
                ...shikiStore.options,
                ...options,
            });
        }
    });

    onMounted(async () => {
        const shiki = await shikiStore.load();
        plain = createPlainShiki(shiki);
        trigger();
    });

    onUnmounted(() => {
        ctx?.dispose();
    });
}
