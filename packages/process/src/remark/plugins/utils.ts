import { visit } from "unist-util-visit";
import type * as hast from "hast";
import type * as mdast from "mdast";
import type { Extension as FromMarkdownExtension } from "mdast-util-from-markdown";
import type { Extension as MicromarkExtension } from "micromark-util-types";
import type { Processor } from "unified";

interface PushExtensionsOptions {
    micromark: MicromarkExtension[];
    fromMarkdown: FromMarkdownExtension[];
}

export function pushExtensions(processor: Processor<mdast.Root>, options: PushExtensionsOptions) {
    const data = processor.data();

    (data.micromarkExtensions ??= []).push(...options.micromark);
    (data.fromMarkdownExtensions ??= []).push(...options.fromMarkdown);
}

export function transformNodes(root: hast.Parent) {
    visit(root, (node: hast.ElementContent, index, parent) => {
        if (node.type === "element") {
            parent?.children.splice(index, 1, {
                type: node.type,
                tag: node.tagName,
                props: node.properties,
                children: node.children
            } as any);
        }
        else if (node.type === "comment") {
            parent?.children.splice(index, 1);
            return index;
        }
        else {
            parent?.children.splice(index, 1, {
                type: node.type,
                value: node.value
            });
        }
    });

    return {
        type: "root",
        children: root.children
    };
}