import type { Element } from "hast";
import type { Code } from "mdast";
import type { Handler } from "mdast-util-to-hast";

export default <Handler> function(state, node: Code) {
  const result: Element = {
    type: "element",
    tagName: "mb-forge",
    properties: {
      lang: node.lang,
      meta: node.meta,
      raw: node.value,
    },
    children: [],
  };
  state.patch(node, result);
  return state.applyData(node, result);
};
