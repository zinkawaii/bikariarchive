import type { Processor } from "unified";
import { transformRoot } from "./utils";
import type { Root } from "../types";

declare module "unified" {
    interface CompileResultMap {
        root: Root;
    }
}

export default function(this: Processor) {
    this.compiler = (root) => {
        return transformRoot(root);
    };
}