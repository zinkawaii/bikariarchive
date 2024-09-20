import type { Element } from "hast";
import type { Code } from "mdast";
import type { Handler } from "mdast-util-to-hast";

export default <Handler> function(state, node: Code) {
    const result: Element = {
        type: "element",
        tagName: "mb-code",
        properties: {
            lang: node.lang,
            raw: node.value
        },
        children: []
    };
    state.patch(node, result);
    return state.applyData(node, result);
};