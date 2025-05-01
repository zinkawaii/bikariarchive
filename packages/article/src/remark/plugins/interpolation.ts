import { codes } from "micromark-util-symbol";
import { getProperty } from "propathy";
import { visit } from "unist-util-visit";
import type { Root, Var } from "mdast";
import type { Extension as FromMarkdownExtension } from "mdast-util-from-markdown";
import type { Code, Construct, Extension as MicromarkExtension } from "micromark-util-types";
import type { Processor } from "unified";
import type { VFile } from "vfile";
import { appendExtensions } from "./utils";

declare module "micromark-util-types" {
    interface TokenTypeMap {
        var: "var";
        varFenceStart: "varFenceStart";
        varExpression: "varExpression";
        varFenceEnd: "varFenceEnd";
    }
}

declare module "mdast" {
    interface RootContentMap {
        var: Var;
    }

    interface Var extends Parent {
        type: "var";
        expression?: string;
    }
}

export default function(this: Processor) {
    appendExtensions(this, {
        micromark: interpolation(),
        fromMarkdown: interpolationFromMarkdown(),
    });

    return (tree: Root, file: VFile) => {
        visit(tree, "var", (node, index, parent) => {
            const value = getProperty(file.data.frontmatters[0], node.expression, "") as string;

            const prev = parent.children[index - 1];
            const next = parent.children[index + 1];

            if (prev?.type === "text") {
                prev.value += value;
                parent.children.splice(index, 1);

                if (next?.type === "text") {
                    prev.value += next.value;
                    parent.children.splice(index, 1);
                }
            }
            else if (next?.type === "text") {
                next.value = value + next.value;
                parent.children.splice(index, 1);
            }
            else {
                parent.children.splice(index, 1, {
                    type: "text",
                    value,
                });
            }
        });
    };
}

function interpolation(): MicromarkExtension {
    const start: Construct = {
        tokenize(effects, ok, nok) {
            let startCurlyBraces = 0;
            let endCurlyBraces = 0;

            effects.enter("var");
            effects.enter("varFenceStart");
            return start;

            function start(code: Code) {
                if (code !== codes.leftCurlyBrace) {
                    return nok(code);
                }

                effects.consume(code);
                startCurlyBraces++;

                if (startCurlyBraces === 1) {
                    return start;
                }
                else {
                    effects.exit("varFenceStart");
                    effects.enter("varExpression");
                    effects.enter("chunkString", { contentType: "string" });
                    return expression;
                }
            }

            function expression(code: Code) {
                if (code === codes.eof) {
                    return nok(code);
                }

                if (code === codes.rightCurlyBrace) {
                    effects.exit("chunkString");
                    effects.exit("varExpression");
                    effects.enter("varFenceEnd");
                    return end(code);
                }

                effects.consume(code);
                return expression;
            }

            function end(code: Code) {
                if (code !== codes.rightCurlyBrace) {
                    return nok(code);
                }

                effects.consume(code);
                endCurlyBraces++;

                if (endCurlyBraces === 1) {
                    return end;
                }
                else {
                    effects.exit("varFenceEnd");
                    effects.exit("var");
                    return ok(code);
                }
            }
        },
    };

    return {
        text: {
            [codes.leftCurlyBrace]: [start],
        },
    };
}

function interpolationFromMarkdown(): FromMarkdownExtension {
    return {
        enter: {
            var(token) {
                this.enter({
                    type: "var",
                    children: [],
                }, token);
            },
            varExpression() {
                this.stack.push({ type: "fragment", children: [] });
            },
        },
        exit: {
            var(token) {
                this.exit(token);
            },
            varExpression() {
                const data = this.resume();
                const element = this.stack.at(-1) as Var;
                element.expression = data.trim();
            },
        },
    };
}
