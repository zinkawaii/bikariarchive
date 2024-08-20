import type { Root } from "mdast";
import GithubSlugger from "github-slugger";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";

export default function() {
    const slugger = new GithubSlugger();
    const numerics = "ABCDEFGHIJ";

    return (tree: Root) => {
        slugger.reset();

        visit(tree, "heading", (node) => {
            ((node.data ??= {}).hProperties ??= {}).id ??= slugger.slug(
                toString(node).replace(/^\d/, (match) => numerics[match])
            );
        });
    };
}