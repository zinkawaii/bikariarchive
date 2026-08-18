import type hast from "hast";
import type { Child, Root } from "../types.ts";

export function transformRoot(root: hast.Root): Root {
  return {
    type: "root",
    children: transformNodes(root.children).filter((node) => node.type !== "text"),
  };
}

export function transformNodes(nodes: hast.RootContent[]) {
  const children: Child[] = [];
  for (const node of nodes) {
    if (node.type === "element") {
      children.push({
        type: node.type,
        tag: node.tagName,
        props: node.properties,
        children: transformNodes(node.children),
      });
    }
    else if (node.type === "raw" || node.type === "text") {
      children.push({
        type: "text",
        value: node.value,
      });
    }
  }
  return children;
}
