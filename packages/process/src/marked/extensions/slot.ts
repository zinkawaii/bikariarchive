import type { TokenizerAndRendererExtension } from "marked";

declare module "marked" {
    interface MarkedOptions {
        slots: Record<string, string>;
    }
}

export default <TokenizerAndRendererExtension> {
    name: "slot",
    level: "block",
    start(src) {
        return src.match(/</)?.index;
    },
    tokenizer(src) {
        const rule = /^<<\s+([^\n]*)\n([\s\S]*?)<<(?:\n|$)/;
        const match = rule.exec(src);
        if (match) {
            const token = {
                type: "slot",
                raw: match[0],
                title: match[1].trim(),
                text: match[2].trim(),
                tokens: []
            };
            this.lexer.blockTokens(token.text, token.tokens);
            return token;
        }
    },
    renderer(token) {
        this.parser.options.slots[token.title] = this.parser.parse(token.tokens);
        return "";
    }
};