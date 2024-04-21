import type { Root } from "mdast";
import type { VFile } from "vfile";
import { visit } from "unist-util-visit";
import YAML from "yaml";

export default function() {
    return (tree: Root, file: VFile) => {
        visit(tree, "yaml", (node) => {
            file.data = YAML.parse(node.value);
        });
    };
}