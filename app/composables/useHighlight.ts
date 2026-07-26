import { type MaybeElement, notNullish, toArray } from "@vueuse/core";

export interface UseHighlightOptions {
  name: string;
  watch?: boolean;
}

export function useHighlight(
  target: MaybeRefOrGetter<MaybeElement | MaybeElement[]>,
  word: MaybeRefOrGetter<string | RegExp>,
  options: UseHighlightOptions,
) {
  const targets = computed(() => {
    const value = toValue(target);
    return toArray(value).map(unrefElement).filter(notNullish);
  });

  const textNodes = computedWithControl(targets, () => {
    const nodes = [];
    for (const target of targets.value) {
      const treeWalker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while (node = treeWalker.nextNode()) {
        nodes.push(node);
      }
    }
    return nodes;
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
      const nodeIdx = Math.max(0, points.findLastIndex((p) => p < wordIdx));
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

  if (options.watch) {
    useMutationObserver(targets, textNodes.trigger, {
      characterData: true,
      childList: true,
      subtree: true,
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

  return {
    update: textNodes.trigger,
  };
}

function findWordIndices(text: string, rule: string | RegExp) {
  const indices: [number, number][] = [];

  if (typeof rule === "string") {
    for (let offset = 0; offset < text.length;) {
      const index = text.indexOf(rule, offset);
      if (index !== -1) {
        offset = index + rule.length;
        indices.push([index, offset]);
      }
      else break;
    }
  }
  else {
    const matches = text.matchAll(rule);
    for (const match of matches) {
      const { 0: text, index } = match;
      indices.push([index, index + text.length]);
    }
  }
  return indices;
}
