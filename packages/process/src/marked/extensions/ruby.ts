import type { TokenizerAndRendererExtension } from "marked";

export default <TokenizerAndRendererExtension> {
    name: "ruby",
    level: "inline",
    start(src) {
        return src.match(/\|/)?.index;
    },
    tokenizer(src) {
        const rule = /^\|([^\n]*?)\(([^\n]*?)\)\|/;
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
};