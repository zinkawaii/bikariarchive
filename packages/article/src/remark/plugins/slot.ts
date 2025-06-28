import { setProperty } from "propathy";
import { visit } from "unist-util-visit";
import type hast from "hast";
import type { Processor } from "unified";
import { transformNodes } from "./utils";

export default function(this: Processor) {
    this.compiler = (root, file) => {
        const { frontmatters } = file.data;
        let frontmatter: Record<string, unknown> | undefined;

        visit(root as hast.Root, (node, index, parent) => {
            if (index === void 0 || parent === void 0 || node.type !== "element") {
                return;
            }
            if (node.tagName === "frontmatter") {
                frontmatter = frontmatters?.[node.properties.order as number];
                parent.children.splice(index, 1);
            }
            else if (node.tagName === "slots" && frontmatter) {
                const slots = node.children
                    .filter((node): node is hast.Element => node.type === "element" && node.tagName === "component-slot")
                    .map((slot) => ({
                        tag: Object.keys(slot.properties)[0].slice("v-slot:".length),
                        children: transformNodes(slot.children),
                    })) ?? [];

                for (const slot of slots) {
                    const path = slot.tag;
                    const content = slot.children;
                    setProperty(frontmatter, path, content);
                }
            }
        });

        return (void 0)!;
    };
}
