import type hast from "hast";
import type { Plugin } from "unified";
import { transformRoot } from "./utils";
import type { Root } from "../types";

declare module "unified" {
    interface CompileResultMap {
        root: Root;
    }
}

export default <Plugin<[], hast.Root, Root>> function() {
    this.compiler = (root) => {
        return transformRoot(root as hast.Root);
    };
};
