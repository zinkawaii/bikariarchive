import type { Element } from "hast";
import type { State } from "mdast-util-to-hast";
import type { BlockComponent, InlineComponent } from "satorigear";

export default function(state: State, node: BlockComponent | InlineComponent) {
  const result: Element = {
    type: "element",
    tagName: node.name,
    // @ts-expect-error null | undefined -> undefined
    properties: node.attributes,
    children: state.all(node),
  };
  state.patch(node, result);
  return state.applyData(node, result);
}
