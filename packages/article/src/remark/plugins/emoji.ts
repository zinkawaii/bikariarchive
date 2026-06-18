import { visit } from "unist-util-visit";
import type { Parent, Root, Text } from "mdast";
import type { Processor } from "unified";

declare module "mdast" {
  interface RootContentMap {
    iconify: Emoji;
  }
}

interface Emoji extends Parent {
  type: "emoji";
}

const iconifyRE = / ?i-[\w-]+:[\w-]+ ?/g;

export default function(this: Processor) {
  return (tree: Root) => {
    visit(tree, "text", (node, index, parent) => {
      if (parent === void 0 || index === void 0) {
        return;
      }

      const indices: [number, string][] = [];
      const matches = node.value.matchAll(iconifyRE);
      for (const match of matches) {
        indices.push([match.index, match[0]]);
      }

      let offset = 0;
      let hasIconify = false;
      const nodes: (Text | Emoji)[] = [];

      for (const [i, name] of [...indices, [node.value.length, ""] as const]) {
        const text = node.value.slice(offset, i);
        if (text) {
          nodes.push({
            type: "text",
            value: text,
          });
        }
        if (name) {
          hasIconify = true;
          nodes.push({
            type: "emoji",
            data: {
              hName: "iconify",
              hProperties: {
                class: "emoji",
                name: name.trim(),
              },
            },
            children: [],
          });
        }
        offset = i + name.length;
      }

      if (hasIconify) {
        parent.children.splice(index, 1, ...nodes);
      }
    });
  };
}
