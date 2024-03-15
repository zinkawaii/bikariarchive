import { encode } from "html-entities";
import { Marked } from "marked";

export default new Marked({
    renderer: {
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
    },
    extensions: [
        {
            name: "ruby",
            level: "inline",
            start(src) {
                return src.match(/\|/)?.index;
            },
            tokenizer(src, tokens) {
                const rule = /^\|([^\n]*?)<([^\n]*?)>\|/;
                const match = rule.exec(src);
                if (match) {
                    return {
                        type: "ruby",
                        raw: match[0],
                        ruby: this.lexer.inlineTokens(match[1].trim()),
                        rt: this.lexer.inlineTokens(match[2].trim())
                    };
                }
            },
            renderer(token) {
                return `<ruby>${this.parser.parseInline(token.ruby)}<rt>${this.parser.parseInline(token.rt)}</rt></ruby>`;
            },
            childTokens: ["ruby", "rt"]
        }
    ],
    hooks: {
        postprocess(html) {
            return html.replaceAll(/(?<=\n)<br(\s*)\/>/g, "<p><br /></p>");
        }
    }
});