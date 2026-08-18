import type { Element } from "hast";
import type { State } from "mdast-util-to-hast";
import type { InlineMath, Math } from "satorigear";

export function math(state: State, node: Math) {
  const result: Element = {
    type: "element",
    tagName: "mb-math",
    properties: {
      type: "block",
      raw: node.value,
    },
    children: [],
  };
  state.patch(node, result);
  return result;
}

export function inlineMath(state: State, node: InlineMath) {
  const result: Element = {
    type: "element",
    tagName: "mb-math",
    properties: {
      type: "inline",
      raw: node.value,
    },
    children: [],
  };
  state.patch(node, result);
  return result;
}
