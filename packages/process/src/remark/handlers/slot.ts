import type { Handler } from "mdast-util-to-hast";
import type { Element } from "hast";

export default <Handler> function(state, node) {
    const result: Element = {
        type: "element",
        tagName: "slot",
        properties: {
            path: node.path
        },
        children: state.all(node)
    };
    state.patch(node, result);
    return state.applyData(node, result);
};