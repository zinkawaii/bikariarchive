import { visit } from "unist-util-visit";
import YAML from "yaml";
import type { Node, Root } from "mdast";
import type { Processor } from "unified";
import type { VFile } from "vfile";

declare module "vfile" {
  interface DataMap {
    frontmatters: Record<string, unknown>[];
  }
}

declare module "mdast" {
  interface RootContentMap {
    frontmatter: Frontmatter;
  }
}

interface Frontmatter extends Node {
  type: "frontmatter";
}

export default function(this: Processor) {
  return (tree: Root, file: VFile) => {
    const frontmatters: Record<string, unknown>[] = [];
    file.data.frontmatters = frontmatters;

    visit(tree, "yaml", (node, index, parent) => {
      if (parent === void 0 || index === void 0) {
        return;
      }

      const data = YAML.parse(node.value) ?? {};

      if (
        parent === tree ||
        parent.type === "blockComponent" && (
          parent.name === "slots" || parent.name === "draft"
        )
      ) {
        frontmatters.push(data);
      }
      else {
        parent.attributes = data;
      }
    });
  };
}
