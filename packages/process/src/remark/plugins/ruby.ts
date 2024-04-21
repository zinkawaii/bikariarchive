import type { Root } from "mdast";
import { visit } from "unist-util-visit";
import { u } from "unist-builder";

export default function() {
    return (tree: Root) => {
        visit(tree, "text", (node, index, parent) => {
            const nodes = tokenizer(node.value).map(
                (e) => ((typeof e === "object")
                    ? u("ruby", { data: { hName: "ruby" } }, [
                        u("text", e.ruby),
                        u("rt", { data: { hName: "rt" } }, [
                            u("text", e.rt)
                        ])
                    ])
                    : u("text", e))
            );
            parent.children.splice(index, 1, ...nodes);
            return index + nodes.length;
        });
    };
}

function tokenizer(src: string) {
    const rule = /\|([^\n]*?)\(([^\n]*?)\)\|/g;
    const result = [];

    let index = 0;
    let match: RegExpExecArray;
    while ((match = rule.exec(src)) !== null) {
        result.push(src.substring(index, match.index));
        result.push({
            ruby: match[1].trim(),
            rt: match[2].trim()
        });
        index = match.index + match[0].length;
    }
    result.push(src.substring(index));
    return result;
}