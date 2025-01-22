import { visit } from "unist-util-visit";
import YAML from "yaml";
import type { Parent, Root } from "mdast";
import type { VFile } from "vfile";

interface Options {
    placeholder?: boolean;
}

export default function(options: Options = {}) {
    return (tree: Root, file: VFile) => {
        const frontmatters = [];

        if (tree.children[0]?.type !== "yaml") {
            patch({}, -1, tree);
        }

        visit(tree, "yaml", (node, index, parent) => {
            patch(node.value, index, parent);
        });

        file.data = {
            frontmatters
        };

        function patch(value: string | object, index: number, parent: Parent) {
            if (typeof value === "string") {
                value = YAML.parse(value) ?? {};
            }
            frontmatters.push(value);

            if (options.placeholder) {
                const start = index === -1 ? 0 : index;
                const count = index === -1 ? 0 : 1;
                parent.children.splice(start, count, {
                    type: "text",
                    value: `id(frontmatter):${frontmatters.length - 1}`
                });
            }
        }
    };
}