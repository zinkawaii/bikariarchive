import { visit } from "unist-util-visit";
import type { Root } from "mdast";

export default function() {
  return (tree: Root) => {
    visit(tree, "paragraph", (node, index, parent) => {
      if (parent === void 0 || index === void 0) {
        return;
      }

      if (
        node.children.length &&
        node.children.every((child) => (
          child.type === "image" || child.type === "text" && child.value === "\n"
        ))
      ) {
        parent.children.splice(index, 1, ...node.children);
      }
    });
  };
}
