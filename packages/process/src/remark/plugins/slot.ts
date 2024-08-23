import { visit } from "unist-util-visit";
import type { Element, Root } from "hast";
import { transformNodes } from "./utils";

export default function() {
    this.compiler = (root: Root) => {
        let slotsComp: Element | undefined;
        visit(root, "element", (node) => {
            if (node.tagName === "slots") {
                slotsComp = node;
            }
        });

        const slots = slotsComp?.children
            .filter((node): node is Element => node.type === "element" && node.tagName === "component-slot")
            .map((slot) => ({
                tag: Object.keys(slot.properties)[0].slice("v-slot:".length),
                children: transformNodes(slot)
            })) ?? [];

        return {
            type: "root",
            children: slots
        };
    };
}