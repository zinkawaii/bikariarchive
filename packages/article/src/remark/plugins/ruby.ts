import { codes } from "micromark-util-symbol";
import type { Ruby } from "mdast";
import type { Extension as FromMarkdownExtension } from "mdast-util-from-markdown";
import type { Code, Construct, Extension as MicromarkExtension } from "micromark-util-types";
import type { Processor } from "unified";
import { appendExtensions } from "./utils";

declare module "micromark-util-types" {
    interface TokenTypeMap {
        ruby: "ruby";
        rubyFenceStart: "rubyFenceStart";
        rubyFenceEnd: "rubyFenceEnd";
        rubyContent: "rubyContent";
        rubyMarker: "rubyMarker";
        rubyMarkerFenceStart: "rubyMarkerFenceStart";
        rubyMarkerFenceEnd: "rubyMarkerFenceEnd";
    }
}

declare module "mdast" {
    interface RootContentMap {
        ruby: Ruby;
    }

    interface Ruby extends Parent {
        type: "ruby";
        content: string;
        marker: string;
    }
}

export default function(this: Processor) {
    appendExtensions(this, {
        micromark: ruby(),
        fromMarkdown: rubyFromMarkdown(),
    });
}

function ruby(): MicromarkExtension {
    const start: Construct = {
        tokenize(effects, ok, nok) {
            return start;

            function start(code: Code) {
                effects.enter("ruby");
                effects.enter("rubyFenceStart");
                effects.consume(code);
                effects.exit("rubyFenceStart");
                effects.enter("rubyContent");
                effects.enter("chunkString", { contentType: "string" });
                return content;
            }

            function content(code: Code) {
                if (code === codes.eof) {
                    return nok(code);
                }

                if (code === codes.leftParenthesis) {
                    effects.exit("chunkString");
                    effects.exit("rubyContent");
                    effects.enter("rubyMarkerFenceStart");
                    effects.consume(code);
                    effects.exit("rubyMarkerFenceStart");
                    effects.enter("rubyMarker");
                    effects.enter("chunkString", { contentType: "string" });
                    return marker;
                }

                effects.consume(code);
                return content;
            }

            function marker(code: Code) {
                if (code === codes.eof) {
                    return nok(code);
                }

                if (code === codes.rightParenthesis) {
                    effects.exit("chunkString");
                    effects.exit("rubyMarker");
                    effects.enter("rubyMarkerFenceEnd");
                    effects.consume(code);
                    effects.exit("rubyMarkerFenceEnd");
                    effects.enter("rubyFenceEnd");
                    return end;
                }

                effects.consume(code);
                return marker;
            }

            function end(code: Code) {
                if (code !== codes.verticalBar) {
                    return nok(code);
                }

                effects.consume(code);
                effects.exit("rubyFenceEnd");
                effects.exit("ruby");
                return ok(code);
            }
        },
    };

    return {
        text: {
            [codes.verticalBar]: [start],
        },
    };
}

function rubyFromMarkdown(): FromMarkdownExtension {
    return {
        enter: {
            ruby(token) {
                this.enter({
                    type: "ruby",
                    content: "",
                    marker: "",
                    data: {
                        hName: "ruby",
                        hChildren: [],
                    },
                    children: [],
                }, token);
            },
            rubyContent() {
                this.stack.push({ type: "fragment", children: [] });
            },
            rubyMarker() {
                this.stack.push({ type: "fragment", children: [] });
            },
        },
        exit: {
            ruby(token) {
                const element = this.stack.at(-1) as Ruby;
                element.data!.hChildren!.push(
                    { type: "text", value: element.content ?? "" },
                    {
                        type: "element",
                        tagName: "rt",
                        properties: {},
                        children: [{ type: "text", value: element.marker ?? "" }],
                    },
                );
                this.exit(token);
            },
            rubyContent() {
                const data = this.resume();
                const element = this.stack.at(-1) as Ruby;
                element.content = data;
            },
            rubyMarker() {
                const data = this.resume();
                const element = this.stack.at(-1) as Ruby;
                element.marker = data;
            },
        },
    };
}
