import type { Root } from "mdast";
import type { Processor } from "unified";
import type { Extension as MicromarkExtension } from "micromark-util-types";
import type { Extension as FromMarkdownExtension } from "mdast-util-from-markdown";

interface PushExtensionsOptions {
    micromark: MicromarkExtension[];
    fromMarkdown: FromMarkdownExtension[];
}

export function pushExtensions(processor: Processor<Root>, options: PushExtensionsOptions) {
    const data = processor.data();

    (data.micromarkExtensions ??= []).push(...options.micromark);
    (data.fromMarkdownExtensions ??= []).push(...options.fromMarkdown);
}