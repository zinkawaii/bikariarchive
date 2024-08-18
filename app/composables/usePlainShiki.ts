import type { CodeToTokensWithThemesOptions } from "shiki";
import { type MountPlainShikiOptions, createPlainShiki } from "plain-shiki";

export default function(
    target: MaybeRefOrGetter<HTMLElement>,
    options: MountPlainShikiOptions
) {
    let ctx: ReturnType<ReturnType<typeof createPlainShiki>["mount"]> | undefined;

    onMounted(async () => {
        const lang = options.lang;
        const shiki = await getShikiHighlighter();
        const shikiOptions = await resolveShikiOptions({ lang }) as CodeToTokensWithThemesOptions;
        await loadShikiLanguages(lang);

        const { mount } = createPlainShiki(shiki);

        watchImmediate(() => toValue(target), (el) => {
            ctx?.dispose();
            if (el) {
                ctx = mount(el, {
                    themes: shikiOptions.themes as any,
                    watch: false,
                    ...options
                });
            }
        });

        useEventListener(target, "input", Zin.debounce(() => {
            ctx?.update();
        }, {
            immediate: false,
            delay: 150
        }));
    });
}