import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";
import type { Root } from "mdast";
import type { Processor } from "unified";

export default function(this: Processor) {
    const slugger = new GithubSlugger();
    const numerics = "OABCDEFGHI";

    return (tree: Root) => {
        slugger.reset();

        visit(tree, "heading", (node) => {
            ((node.data ??= {}).hProperties ??= {}).id ??= slugger.slug(
                toString(node).replace(/^\d/, (match) => numerics[match as any]),
            );
        });
    };
}
