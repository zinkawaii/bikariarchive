import { frontmatterFromMarkdown } from "mdast-util-frontmatter";
import { frontmatter, type Matter } from "micromark-extension-frontmatter";
import { visit } from "unist-util-visit";
import YAML from "yaml";
import type { Node, Root } from "mdast";
import type { Processor } from "unified";
import type { VFile } from "vfile";
import { appendExtensions } from "./utils";

declare module "vfile" {
    interface DataMap {
        frontmatters: Record<string, unknown>[];
    }
}

declare module "mdast" {
    interface RootContentMap {
        frontmatter: Frontmatter;
    }
}

interface Frontmatter extends Node {
    type: "frontmatter";
}

interface Options {
    fallthrough?: boolean;
}

export default function(this: Processor, options?: Options & Matter) {
    appendExtensions(this, {
        micromark: frontmatter(options),
        fromMarkdown: frontmatterFromMarkdown(options)
    });

    return (tree: Root, file: VFile) => {
        const frontmatters = [];

        if (tree.children[0]?.type !== "yaml") {
            tree.children.unshift({
                type: "yaml",
                value: ""
            });
        }

        visit(tree, "yaml", (node, index, parent) => {
            const data = YAML.parse(node.value) ?? {};
            frontmatters.push(data);

            if (options?.fallthrough) {
                parent.children.splice(index, 1, {
                    type: "frontmatter",
                    data: {
                        hName: "frontmatter",
                        hProperties: {
                            order: frontmatters.length - 1
                        }
                    }
                });
            }
        });

        file.data = {
            frontmatters
        };
    };
}