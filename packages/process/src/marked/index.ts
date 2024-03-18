import { Marked } from "marked";
import renderer from "./options/renderer";
import ruby from "./extensions/ruby";
import slot from "./extensions/slot";

export const articleMarked = new Marked({
    renderer,
    extensions: [
        ruby
    ],
    hooks: {
        postprocess(html) {
            return html.replaceAll(/(?<=\n)<br(\s*)\/>/g, "<p><br /></p>");
        }
    }
});

export const entryMarked = new Marked({
    renderer,
    extensions: [
        ruby,
        slot
    ],
    hooks: {
        preprocess(markdown) {
            this.options.slots = {};
            return markdown;
        },
        postprocess() {
            return this.options.slots;
        }
    }
});