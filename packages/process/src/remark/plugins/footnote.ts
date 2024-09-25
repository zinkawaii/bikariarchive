import { gfmFootnoteFromMarkdown } from "mdast-util-gfm-footnote";
import { gfmFootnote } from "micromark-extension-gfm-footnote";
import type { Processor } from "unified";
import { pushExtensions } from "./utils";

export default function(this: Processor) {
    pushExtensions(this, {
        micromark: [gfmFootnote()],
        fromMarkdown: [gfmFootnoteFromMarkdown()]
    });
}