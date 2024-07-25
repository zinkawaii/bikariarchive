import { gfmFootnote } from "micromark-extension-gfm-footnote";
import { gfmFootnoteFromMarkdown } from "mdast-util-gfm-footnote";
import type { Root } from "mdast";
import type { Processor } from "unified";
import { pushExtensions } from "./utils";

export default function(this: Processor<Root>) {
    pushExtensions(this, {
        micromark: [gfmFootnote()],
        fromMarkdown: [gfmFootnoteFromMarkdown()]
    });
}