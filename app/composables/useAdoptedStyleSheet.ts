export function useAdoptedStyleSheet(
    cssText: TemplateStringsArray,
    ...cssVars: MaybeRefOrGetter<unknown>[]
) {
    let styleSheet: CSSStyleSheet;

    const entries = cssVars.map((source) => [
        randomHash(8),
        source,
    ]);

    tryOnMounted(() => {
        styleSheet = new CSSStyleSheet();
        document.adoptedStyleSheets.push(styleSheet);

        const css = cssText.reduce((acc, str, i) => {
            const value = entries[i] ? `var(--${entries[i][0]})` : "";
            return acc + str + value;
        }, "");

        styleSheet.replaceSync(`:root {} ${css}`);
        update(getVals());
    });

    tryOnUnmounted(() => {
        const i = document.adoptedStyleSheets.indexOf(styleSheet);
        if (i !== -1) {
            document.adoptedStyleSheets.splice(i, 1);
        }
    });

    watch(getVals, update, {
        flush: "sync",
    });

    function getVals() {
        return entries.map(([, source]) => toValue(source));
    }

    function update(newVals: unknown[]) {
        styleSheet.deleteRule(0);
        styleSheet.insertRule(/* CSS */`
            :root {
                ${newVals.map((val, i) => `--${entries[i][0]}: ${val};`).join("\n")}
            }
        `, 0);
    }
}
