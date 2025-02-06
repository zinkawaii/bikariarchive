import type hast from "hast";
import type { Extension as FromMarkdownExtension } from "mdast-util-from-markdown";
import type { Extension as MicromarkExtension } from "micromark-util-types";
import type { Processor } from "unified";
import type { Child, Root } from "../types";

interface PushExtensionsOptions {
    micromark: MicromarkExtension;
    fromMarkdown: FromMarkdownExtension;
}

export function appendExtensions(processor: Processor, options: PushExtensionsOptions) {
    const data = processor.data();

    (data.micromarkExtensions ??= []).push(options.micromark);
    (data.fromMarkdownExtensions ??= []).push(options.fromMarkdown);
}

export function transformRoot(root: hast.Root) {
    return {
        type: "root",
        children: transformNodes(root.children).filter((node) => node.type !== "text")
    } as Root;
}

export function transformNodes(nodes: hast.RootContent[]) {
    const children: Child[] = [];
    for (const node of nodes) {
        if (node.type === "element") {
            children.push({
                type: node.type,
                tag: node.tagName,
                props: node.properties,
                children: transformNodes(node.children)
            });
        }
        else if (node.type === "raw" || node.type === "text") {
            children.push({
                type: "text",
                value: node.value
            });
        }
    }
    return children;
}