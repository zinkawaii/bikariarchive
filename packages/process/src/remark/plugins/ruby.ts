import type { Root } from "mdast";
import { findAndReplace } from "mdast-util-find-and-replace";
import { u } from "unist-builder";

export default function() {
    const RE_RUBY = /\|([^\n]*?)\(([^\n]*?)\)\|/g;

    return (tree: Root) => {
        findAndReplace(tree, [
            [RE_RUBY, (...match) => {
                return u("ruby", {
                    data: { hName: "ruby" }
                }, [
                    u("text", match[1].trim()),
                    u("rt", { data: { hName: "rt" } }, match[2].trim())
                ]) as any;
            }]
        ]);
    };
}