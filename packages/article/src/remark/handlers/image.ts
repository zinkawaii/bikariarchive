import type { Element } from "hast";
import type { Image } from "mdast";
import type { Handler } from "mdast-util-to-hast";

export default <Handler> function(state, node: Image) {
    const result: Element = {
        type: "element",
        tagName: "mb-image",
        properties: {
            src: node.url,
            alt: node.alt,
            title: node.title
        },
        children: []
    };
    state.patch(node, result);
    return state.applyData(node, result);
};