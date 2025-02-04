import { gfmStrikethroughFromMarkdown } from "mdast-util-gfm-strikethrough";
import { gfmStrikethrough, type Options } from "micromark-extension-gfm-strikethrough";
import type { Processor } from "unified";
import { appendExtensions } from "./utils";

export default function(this: Processor) {
    const options: Options = {
        singleTilde: false
    };
    appendExtensions(this, {
        micromark: gfmStrikethrough(options),
        fromMarkdown: gfmStrikethroughFromMarkdown()
    });
}