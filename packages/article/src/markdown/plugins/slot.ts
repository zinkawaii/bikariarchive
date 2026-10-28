import { setProperty } from "propathy";
import type hast from "hast";
import type { Plugin } from "unified";
import { transformNodes } from "./utils.ts";

declare module "unified" {
  interface CompileResultMap {
    frontmatters: Record<string, unknown>[];
  }
}

// eslint-disable-next-line func-style
const plugin: Plugin<[], hast.Root, Record<string, unknown>[]> = function() {
  this.compiler = (root, file) => {
    const { frontmatters } = file.data;

    let i = 0;
    for (const node of (root as hast.Root).children) {
      if (node.type !== "element" || node.tagName !== "slots" && node.tagName !== "draft") {
        continue;
      }
      const frontmatter = frontmatters?.[i++] ?? (i--, {});

      for (const child of node.children) {
        if (child.type !== "element" || child.tagName !== "template") {
          continue;
        }
        const tag = child.properties.name!.replaceAll("-", ".");
        const children = transformNodes(child.children);
        setProperty(frontmatter, tag, children);
      }
    }
    return frontmatters ?? [];
  };
};

export default plugin;
