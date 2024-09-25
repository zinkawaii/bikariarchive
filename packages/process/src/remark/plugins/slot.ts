import { visit } from "unist-util-visit";
import type * as hast from "hast";
import type { Processor } from "unified";
import { transformNodes } from "./utils";
import type { Root } from "../types";

export default function(this: Processor) {
    this.compiler = (root) => {
        let slotsComp: hast.Element | undefined;
        visit(root as hast.Root, "element", (node) => {
            if (node.tagName === "slots") {
                slotsComp = node;
            }
        });

        const slots = slotsComp?.children
            .filter((node): node is hast.Element => node.type === "element" && node.tagName === "component-slot")
            .map((slot) => ({
                tag: Object.keys(slot.properties)[0].slice("v-slot:".length),
                children: transformNodes(slot)
            })) ?? [];

        return {
            type: "root",
            children: slots
        } as Root;
    };
}