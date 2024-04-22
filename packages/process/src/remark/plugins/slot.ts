import type { Root } from "mdast";
import { visit } from "unist-util-visit";
import { u } from "unist-builder";

export default function() {
    return (tree: Root) => {
        visit(tree, "paragraph", ({ children }, index, parent) => {
            const startRule = /^<<\s+([^\n]*)\n/;
            const endRule = /<<(?:\n|$)/;
            const start = children.at(0);
            const end = children.at(-1);

            if (start.type !== "text" || end.type !== "text") return;

            let startMatch: RegExpExecArray,
                endMatch: RegExpExecArray;

            if (
                !(startMatch = startRule.exec(start.value)) ||
                !(endMatch = endRule.exec(end.value))
            ) return;

            if (children.length === 1) {
                start.value = start.value.substring(
                    startMatch[0].length,
                    start.value.length - endMatch[0].length
                );
            }
            else {
                start.value = start.value.substring(
                    startMatch[0].length
                );
                end.value = end.value.substring(
                    0,
                    end.value.length - endMatch[0].length
                );
            }

            const res = u("slot", {
                data: {
                    hName: "slot",
                    hProperties: {
                        path: startMatch[1].trim()
                    }
                }
            }, [
                u("paragraph", children)
            ]);
            parent.children.splice(index, 1, res as any);
            return index + 1;
        });
    };
}