import type hast from "hast";
import type { Plugin, Processor } from "unified";
import { transformRoot } from "./utils";
import type { Root } from "../types";

declare module "unified" {
    interface CompileResultMap {
        root: Root;
    }
}

export default <Plugin<[], Root>> function(this: Processor) {
    this.compiler = (root: hast.Root) => {
        return transformRoot(root);
    };
};
