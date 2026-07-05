import { lookup } from "mrmime";
import { extname } from "pathe";
import { parsePath } from "ufo";
import type { Element } from "hast";
import type { Image } from "mdast";
import type { Handler } from "mdast-util-to-hast";

export default <Handler> function(state, node: Image) {
  const path = parsePath(node.url).pathname;
  const ext = extname(path).slice(1).toLowerCase();

  const result: Element = lookup(ext)?.startsWith("video/")
    ? {
      type: "element",
      tagName: "mb-video",
      properties: {
        ...node.attributes,
        src: node.url,
        caption: node.title,
      },
      children: [],
    }
    : {
      type: "element",
      tagName: "mb-image",
      properties: {
        ...node.attributes,
        src: node.url,
        alt: node.alt,
        caption: node.title,
      },
      children: [],
    };

  state.patch(node, result);
  return state.applyData(node, result);
};
