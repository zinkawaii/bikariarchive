import type { Element } from "hast";
import type { Link } from "mdast";
import type { State } from "mdast-util-to-hast";

export default function(state: State, node: Link) {
  const result: Element = {
    type: "element",
    tagName: "plain-link",
    properties: {
      ...node.attributes,
      to: node.url,
      // null | undefined -> undefined
      title: node.title ?? void 0,
    },
    children: state.all(node),
  };
  state.patch(node, result);
  return state.applyData(node, result);
}
