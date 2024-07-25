import { type Options, gfmStrikethrough } from "micromark-extension-gfm-strikethrough";
import { gfmStrikethroughFromMarkdown } from "mdast-util-gfm-strikethrough";
import type { Root } from "mdast";
import type { Processor } from "unified";
import { pushExtensions } from "./utils";

export default function(this: Processor<Root>) {
    const options: Options = {
        singleTilde: false
    };
    pushExtensions(this, {
        micromark: [gfmStrikethrough(options)],
        fromMarkdown: [gfmStrikethroughFromMarkdown()]
    });
}