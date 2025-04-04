import type { Element } from "hast";
import type { Handler } from "mdast-util-to-hast";

const math: Handler = (state, node) => {
    const result: Element = {
        type: "element",
        tagName: "mb-math",
        properties: {
            type: "block",
            raw: node.value
        },
        children: []
    };
    state.patch(node, result);
    return result;
};

const inlineMath: Handler = (state, node) => {
    const result: Element = {
        type: "element",
        tagName: "mb-math",
        properties: {
            type: "inline",
            raw: node.value
        },
        children: []
    };
    state.patch(node, result);
    return result;
};

export default {
    math,
    inlineMath
};