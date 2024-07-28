import type { MaybeComputedElementRef, MaybeElement } from "@vueuse/core";

export interface UseHighlightOptions {
    name: string;
    watch?: boolean;
}

export default function(
    target: MaybeComputedElementRef | MaybeComputedElementRef[] | MaybeRefOrGetter<MaybeElement[]>,
    word: MaybeRefOrGetter<string>,
    options: UseHighlightOptions
) {
    if (import.meta.server) {
        return;
    }

    if (!CSS.highlights) {
        console.warn("CSS Custom Highlight API is not supported.");
        return;
    }

    const targets = computed(() => {
        const value = toValue(target);
        return (Array.isArray(value) ? value : [value])
            .map(unrefElement)
            .filter(Boolean);
    });

    const textNodes = ref<Node[]>([]);
    function updateTextNodes() {
        textNodes.value = [];

        for (const target of targets.value) {
            const treeWalker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
            let currentNode: Node | null;
            while (currentNode = treeWalker.nextNode()) {
                textNodes.value.push(currentNode);
            }
        }
    }

    watchImmediate(targets, updateTextNodes);

    options.watch &&
    useMutationObserver(targets, updateTextNodes, {
        characterData: true,
        childList: true,
        subtree: true
    });

    const ranges = computed(() => {
        const searchWord = toValue(word);
        const { length } = searchWord;
        if (!length) {
            return [];
        }

        let fullText = "";
        const points = [0];
        for (const node of textNodes.value) {
            fullText += node.textContent;
            points.push(fullText.length);
        }

        const indices = [];
        for (let offset = 0; offset < fullText.length;) {
            const idx = fullText.indexOf(searchWord, offset);
            if (idx !== -1) {
                indices.push(idx);
                offset = idx + length;
            }
            else break;
        }

        function findNodeAndOffset(wordIdx: number): [Node, number] {
            const nodeIdx = points.findIndex((p) => p > wordIdx) - 1;
            const node = textNodes.value[nodeIdx];
            const offset = wordIdx - points[nodeIdx];
            return [node, offset];
        }

        return indices.map((idx) => {
            const [startNode, startOffset] = findNodeAndOffset(idx);
            const [endNode, endOffset] = findNodeAndOffset(idx + length);

            const range = new Range();
            range.setStart(startNode, startOffset);
            range.setEnd(endNode, endOffset);
            return range;
        });
    });

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