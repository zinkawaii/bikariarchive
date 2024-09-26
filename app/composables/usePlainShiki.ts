import { createPlainShiki, type CreatePlainShikiReturns, type MountPlainShikiOptions } from "plain-shiki";

export default function(
    target: MaybeRefOrGetter<HTMLElement>,
    options: MountPlainShikiOptions
) {
    let ctx: ReturnType<CreatePlainShikiReturns["mount"]>;

    onMounted(async () => {
        const shiki = await getShikiHighlighter();
        const shikiOptions = await resolveShikiOptions();
        await loadShikiLanguages(options.lang);

        const { mount } = createPlainShiki(shiki);

        watchImmediate(() => toValue(target), (el) => {
            ctx?.dispose();
            if (el) {
                ctx = mount(el, {
                    ...shikiOptions,
                    ...options,
                    watch: false
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