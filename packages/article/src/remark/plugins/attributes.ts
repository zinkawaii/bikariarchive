import { visit } from "unist-util-visit";
import YAML from "yaml";
import type { Root } from "mdast";
import type { VFile } from "vfile";

interface Options {
    placeholder?: boolean;
}

export default function(options: Options = {}) {
    return (tree: Root, file: VFile) => {
        const frontmatters = [];
        visit(tree, "yaml", (node, index, parent) => {
            const data = YAML.parse(node.value);
            frontmatters.push(data);

            if (options.placeholder) {
                parent.children.splice(index, 1, {
                    type: "text",
                    value: `id(frontmatter):${frontmatters.length - 1}`
                });
            }
        });

        file.data = {
            frontmatters
        };
    };
}