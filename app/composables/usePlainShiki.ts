import type { CodeToTokensWithThemesOptions, ThemedTokenWithVariants } from "shiki";

export interface UsePlainShikiOptions {
    lang: string;
    watch?: boolean;
}

interface ColorLoads {
    token: ThemedTokenWithVariants;
    range: Range;
}

export default function(
    target: MaybeRefOrGetter<HTMLElement>,
    options: UsePlainShikiOptions
) {
    const isSupported = useSupported(() => CSS.highlights);

    if (isSupported.value && options.watch) {
        useEventListener(target, "input", Zin.debounce(update, {
            delay: 150,
            immediate: false
        }));
    }

    let getTokenLines: (text: string) => ThemedTokenWithVariants[][];
    let stylesheet: CSSStyleSheet;

    onMounted(async () => {
        const lang = options.lang;
        const shiki = await getShikiHighlighter();
        const shikiOptions = await resolveShikiOptions({ lang }) as CodeToTokensWithThemesOptions;
        await loadShikiLanguages(lang);
        getTokenLines = (text) => shiki.codeToTokensWithThemes(text, shikiOptions);

        stylesheet = new CSSStyleSheet();
        document.adoptedStyleSheets.push(stylesheet);

        update();
    });

    const colorRanges = new Map<string, Range[]>();

    function patch(loads: ColorLoads[]) {
        const deleted = new Set<string>();

        for (const { token, range } of loads) {
            for (const theme in token.variants) {
                const { color } = token.variants[theme];
                const name = `shiki-${theme}-${color.slice(1).toLowerCase()}`;
                const isDefault = theme === "light";

                let highlight = CSS.highlights.get(name);
                if (!highlight) {
                    CSS.highlights.set(name, highlight = new Highlight());
                    highlight.priority = isDefault ? 0 : 1;
                }

                let ranges = colorRanges.get(name);
                if (!ranges) {
                    const rule = `${
                        isDefault ? ":root" : `[z-${theme}]`
                    }::highlight(${name}) { color: ${color}; }`;
                    stylesheet.insertRule(rule);
                    colorRanges.set(name, ranges = []);
                }

                if (!deleted.has(name)) {
                    deleted.add(name);
                    for (const range of ranges) {
                        highlight.delete(range);
                    }
                    ranges.length = 0;
                }

                highlight.add(range);
                ranges.push(range);
            }
        }
    }

    function update() {
        const childNodes = unrefElement(target).childNodes;
        const textContent = [...childNodes].map((node) => node.textContent).join("");
        const tokenLines = getTokenLines(textContent);

        const loads: ColorLoads[] = [];
        for (const tokens of tokenLines) {
            for (const token of tokens) {
                const [node, offset] = findNodeAndOffset(token.offset);
                const range = document.createRange();
                range.setStart(node, offset);
                range.setEnd(node, offset + token.content.length);

                loads.push({ token, range });
            }
        }
        patch(loads);

        function findNodeAndOffset(tokenOffset: number): [Node, number] {
            let offset = 0;
            for (const node of childNodes) {
                if (offset + node.textContent.length > tokenOffset) {
                    return [node, tokenOffset - offset];
                }
                else {
                    offset += node.textContent.length;
                }
            }
        }
    }

    return {
        isSupported,
        update
    };
}