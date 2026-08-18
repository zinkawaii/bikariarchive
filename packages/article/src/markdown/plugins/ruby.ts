import { visit } from "unist-util-visit";
import type { Root } from "hast";

export default function() {
  return (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      if (parent === void 0 || index === void 0) {
        return;
      }

      if (node.tagName === "ruby" && node.properties.rt !== void 0) {
        node.children.push({
          type: "element",
          tagName: "rt",
          properties: {},
          children: [{
            type: "text",
            value: node.properties.rt as string,
          }],
        });
        delete node.properties.rt;
      }
    });
  };
}
