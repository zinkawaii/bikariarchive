import { gfmStrikethroughFromMarkdown } from "mdast-util-gfm-strikethrough";
import { gfmStrikethrough, type Options } from "micromark-extension-gfm-strikethrough";
import type { Processor } from "unified";
import { pushExtensions } from "./utils";

export default function(this: Processor) {
    const options: Options = {
        singleTilde: false
    };
    pushExtensions(this, {
        micromark: [gfmStrikethrough(options)],
        fromMarkdown: [gfmStrikethroughFromMarkdown()]
    });
}