import { visit } from "unist-util-visit";
import YAML from "yaml";
import type { Root } from "mdast";
import type { VFile } from "vfile";

export default function() {
    return (tree: Root, file: VFile) => {
        visit(tree, "yaml", (node) => {
            file.data = YAML.parse(node.value);
        });
    };
}