import type hast from "hast";
import type { Plugin } from "unified";
import { transformRoot } from "./utils.ts";
import type { Root } from "../types.ts";

declare module "unified" {
  interface CompileResultMap {
    root: Root;
  }
}

// eslint-disable-next-line func-style
const plugin: Plugin<[], hast.Root, Root> = function() {
  this.compiler = (root) => {
    return transformRoot(root as hast.Root);
  };
};

export default plugin;
