import type { Element } from "hast";
import type { Code } from "mdast";
import type { State } from "mdast-util-to-hast";

export default function(state: State, node: Code) {
  const result: Element = {
    type: "element",
    tagName: "mb-forge",
    properties: {
      // null | undefined -> undefined
      lang: node.lang ?? void 0,
      meta: node.meta,
      raw: node.value,
    },
    children: [],
  };
  state.patch(node, result);
  return state.applyData(node, result);
}
