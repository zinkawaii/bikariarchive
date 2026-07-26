export function useAdoptedStyleSheet(
  cssText: TemplateStringsArray,
  ...cssVars: MaybeRefOrGetter<unknown>[]
) {
  let styleSheet: CSSStyleSheet;

  const hashs = Array.from({ length: cssVars.length }, () => randomHash(8));

  onMounted(() => {
    styleSheet = new CSSStyleSheet();
    document.adoptedStyleSheets.push(styleSheet);

    const css = cssText.reduce((acc, str, i) => {
      const value = hashs[i] ? `var(--${hashs[i]})` : "";
      return acc + str + value;
    }, "");

    styleSheet.replaceSync(`:root {} ${css}`);
    const newVals = cssVars.map((source) => toValue(source));
    update(newVals);
  });

  onUnmounted(() => {
    const i = document.adoptedStyleSheets.indexOf(styleSheet);
    if (i !== -1) {
      document.adoptedStyleSheets.splice(i, 1);
    }
  });

  watch(cssVars, update, {
    flush: "sync",
  });

  function update(newVals: unknown[]) {
    styleSheet.deleteRule(0);
    styleSheet.insertRule(/* CSS */`
      :root {
        ${newVals.map((val, i) => `--${hashs[i]}: ${val};`).join("\n")}
      }
    `, 0);
  }
}
