import { encode } from "html-entities";
import { RendererObject } from "marked";

export default <RendererObject> {
    code(code, infostring) {
        return `<mb-code lang="${infostring}"><pre>${encode(code)}</pre></mb-code>\n`;
    },
    link(href, title, text) {
        let extra;
        if (!href.startsWith("/")) {
            extra = `target="_blank" rel="noopener noreferrer nofollow"`;
        }
        return `<a class="coco-link" href="${href}" ${title ? `title=${title}` : ""} ${extra}>${text}</a>`;
    },
    text(text) {
        return text.replaceAll("\n", "");
    }
};