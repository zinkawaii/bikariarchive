import type { Element } from "hast";
import type { Link } from "mdast";
import type { Handler } from "mdast-util-to-hast";

export default <Handler> function(state, node: Link) {
  const result: Element = {
    type: "element",
    tagName: "plain-link",
    properties: {
      ...node.attributes,
      to: node.url,
      title: node.title,
    },
    children: state.all(node),
  };
  state.patch(node, result);
  return state.applyData(node, result);
};
