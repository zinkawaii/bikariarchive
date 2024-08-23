import { visit } from "unist-util-visit";
import type { ElementContent, Root } from "hast";

export default function() {
    this.compiler = (root: Root) => {
        visit(root, (node: ElementContent, index, parent) => {
            if (node.type === "element") {
                parent.children.splice(index, 1, {
                    type: node.type,
                    tag: node.tagName,
                    props: node.properties,
                    children: node.children
                } as any);
            }
            else if (
                node.type === "text" && !node.value.trim() ||
                node.type === "comment"
            ) {
                parent.children.splice(index, 1);
                return index;
            }
            else {
                parent?.children.splice(index, 1, {
                    type: node.type,
                    value: node.value
                });
            }
        });

        return {
            type: "root",
            children: root.children
        };
    };
}