import { type MaybeComputedElementRef, type MaybeElement, notNullish, toArray } from "@vueuse/core";

export interface UseHighlightOptions {
    name: string;
    watch?: boolean;
}

export default function(
    target: MaybeComputedElementRef | MaybeComputedElementRef[] | MaybeRefOrGetter<MaybeElement[]>,
    word: MaybeRefOrGetter<string | RegExp>,
    options: UseHighlightOptions
) {
    const isSupported = useSupported(() => CSS.highlights);

    const targets = computed(() => {
        const value = toValue(target);
        return toArray(value).map(unrefElement).filter(notNullish);
    });

    const textNodes = computedWithControl(targets, () => {
        const res = [];
        for (const target of targets.value) {
            const treeWalker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
            let currentNode = treeWalker.nextNode();
            while (currentNode) {
                res.push(currentNode);
                currentNode = treeWalker.nextNode();
            }
        }
        return res;
    });

    const ranges = computed(() => {
        const rule = toValue(word);
        const { length } = rule.toString();
        if (!length) {
            return [];
        }

        let text = "";
        const points = [0];
        for (const node of textNodes.value) {
            text += node.textContent;
            points.push(text.length);
        }

        const indices = findWordIndices(text, rule);

        function findNodeAndOffset(wordIdx: number) {
            const nodeIdx = Math.max(0, points.findIndex((p) => p > wordIdx) - 1);
            const node = textNodes.value[nodeIdx];
            const offset = wordIdx - points[nodeIdx];
            return [node, offset] as const;
        }

        return indices.map(([start, end]) => {
            const [startNode, startOffset] = findNodeAndOffset(start);
            const [endNode, endOffset] = findNodeAndOffset(end);

            const range = new Range();
            range.setStart(startNode, startOffset);
            range.setEnd(endNode, endOffset);
            return range;
        });
    });

    if (isSupported.value) {
        if (options.watch) {
            useMutationObserver(targets, textNodes.trigger, {
                characterData: true,
                childList: true,
                subtree: true
            });
        }

        const highlight = CSS.highlights.get(options.name) ?? new Highlight();
        CSS.highlights.set(options.name, highlight);

        watch(ranges, (newVal, oldVal = []) => {
            for (const range of oldVal) {
                highlight.delete(range);
            }
            for (const range of newVal) {
                highlight.add(range);
            }
        });
    }

    return {
        isSupported,
        update: textNodes.trigger
    };
}

function findWordIndices(text: string, rule: string | RegExp) {
    const indices: [number, number][] = [];

    if (typeof rule === "string") {
        for (let offset = 0; offset < text.length;) {
            const idx = text.indexOf(rule, offset);
            if (idx !== -1) {
                offset = idx + rule.length;
                indices.push([idx, offset]);
            }
            else break;
        }
    }
    else {
        const matches = text.matchAll(rule);
        for (const match of matches) {
            const { 0: res, index } = match;
            indices.push([index, index + res.length]);
        }
    }
    return indices;
}