import { visit } from "unist-util-visit";
import type { Parent, Root, Text } from "mdast";

declare module "mdast" {
    interface RootContentMap {
        iconify: Emoji;
    }
}

interface Emoji extends Parent {
    type: "emoji";
}

const ICONIFY_REGEX = / ?i-[\w-]+:[\w-]+ ?/g;

export default function() {
    return (tree: Root) => {
        visit(tree, "text", (node, index, parent) => {
            const indices: [number, string][] = [];
            const matches = node.value.matchAll(ICONIFY_REGEX);
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
                        value: text
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
                                name: name.trim()
                            }
                        },
                        children: []
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