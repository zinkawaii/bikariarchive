import { setProperty } from "propathy";
import { visit } from "unist-util-visit";
import type * as hast from "hast";
import type { Processor } from "unified";
import { transformNodes } from "./utils";

export default function(this: Processor) {
    this.compiler = (root, file) => {
        let frontmatter: Record<string, any>;

        visit(root as hast.Root, (node) => {
            if (node.type === "text") {
                const match = node.value.match(/id\(frontmatter\):(\d+)\n/);
                if (match) {
                    const index = match[1];
                    frontmatter = file.data.frontmatters[index];
                }
            }
            else if (node.type === "element" && node.tagName === "slots" && frontmatter) {
                const slots = node.children
                    .filter((node): node is hast.Element => node.type === "element" && node.tagName === "component-slot")
                    .map((slot) => ({
                        tag: Object.keys(slot.properties)[0].slice("v-slot:".length),
                        children: transformNodes(slot)
                    })) ?? [];

                for (const slot of slots) {
                    const path = slot.tag;
                    const content = slot.children;
                    setProperty(frontmatter, path, content);
                }
            }
        });

        return void 0;
    };
}