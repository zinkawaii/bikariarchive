import type { Root } from "hast";
import { transformNodes } from "./utils";

export default function() {
    this.compiler = (root: Root) => {
        return transformNodes(root);
    };
}