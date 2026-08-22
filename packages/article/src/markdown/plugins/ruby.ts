import { visit } from "unist-util-visit";
import type { Root } from "mdast";

export default function() {
  return (tree: Root) => {
    visit(tree, "inlineComponent", (node, index, parent) => {
      if (parent === void 0 || index === void 0) {
        return;
      }

      if (node.name === "ruby" && node.attributes.rt !== void 0) {
        node.children.push({
          type: "inlineComponent",
          name: "rt",
          attributes: {},
          children: [{
            type: "text",
            value: node.attributes.rt as string,
          }],
        });
        delete node.attributes.rt;
      }
    });
  };
}
