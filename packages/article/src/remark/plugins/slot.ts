import { setProperty } from "propathy";
import { visit } from "unist-util-visit";
import type hast from "hast";
import type { Processor } from "unified";
import { transformNodes } from "./utils.ts";

export default function(this: Processor) {
  this.compiler = (root, file) => {
    const { frontmatters } = file.data;
    let frontmatter: Record<string, unknown> | undefined;

    visit(root as hast.Root, "element", (node, index, parent) => {
      if (parent === void 0 || index === void 0) {
        return;
      }
      if (node.tagName === "frontmatter") {
        frontmatter = frontmatters?.[node.properties.index as number];
        parent.children.splice(index, 1);
      }
      else if (node.tagName === "slots" && frontmatter) {
        for (const child of node.children) {
          if (child.type !== "element" || child.tagName !== "component-slot") {
            continue;
          }
          const tag = Object.keys(child.properties)[0].slice("v-slot:".length);
          const children = transformNodes(child.children);
          setProperty(frontmatter, tag, children);
        }
      }
    });

    return (void 0)!;
  };
}
