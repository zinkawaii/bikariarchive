import { gfmFootnoteFromMarkdown } from "mdast-util-gfm-footnote";
import { gfmFootnote } from "micromark-extension-gfm-footnote";
import type { Processor } from "unified";
import { appendExtensions } from "./utils.ts";

export default function(this: Processor) {
  appendExtensions(this, {
    micromark: gfmFootnote(),
    fromMarkdown: gfmFootnoteFromMarkdown(),
  });
}
