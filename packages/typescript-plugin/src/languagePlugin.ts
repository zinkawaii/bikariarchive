/// <reference types="@volar/typescript" />

import { type CodeMapping, forEachEmbeddedCode, type LanguagePlugin, type VirtualCode } from "@volar/language-core";
import { dirname, join, matchesGlob } from "pathe";
import frontmatter from "remark-frontmatter";
import mdc from "remark-mdc";
import parse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { parseDocument } from "yaml";
import type mdast from "mdast";
import type ts from "typescript";
import { generateFrontmatter } from "./codegen/generateFrontmatters";
import type { Code, Config, Expression, Frontmatter, Mapping } from "./types";

interface Context {
    root: string;
    config: Config;
}

export function createLanguagePlugin(
    compilerOptions: ts.CompilerOptions,
    config: Config,
): LanguagePlugin<string> {
    const context: Context = {
        root: dirname(compilerOptions.configFilePath as string),
        config,
    };

    return {
        getLanguageId(uri) {
            if (uri.endsWith(".md")) {
                return "mdz";
            }
        },
        createVirtualCode(uri, languageId, snapshot) {
            if (languageId === "mdz") {
                return new MdzVirtualCode(snapshot, uri, context);
            }
        },
        typescript: {
            extraFileExtensions: [{
                extension: "md",
                isMixedContent: true,
                scriptKind: 7 satisfies ts.ScriptKind.Deferred,
            }],
            getServiceScript(root) {
                for (const code of forEachEmbeddedCode(root)) {
                    if (code.languageId === "typescript") {
                        return {
                            code,
                            extension: ".ts",
                            scriptKind: 3 satisfies ts.ScriptKind.TS,
                        };
                    }
                }
            },
        },
    };
}

export class MdzVirtualCode implements VirtualCode {
    id = "root";
    languageId = "mdz";
    embeddedCodes: VirtualCode[] = [];
    mappings: CodeMapping[] = [];

    constructor(
        public snapshot: ts.IScriptSnapshot,
        public fileName: string,
        context: Context,
    ) {
        let options: Mapping = {
            patterns: [],
            frontmatter: [],
        };

        const { root, config } = context;
        outer: for (const mapping of config.mappings) {
            for (const pattern of mapping.patterns) {
                if (matchesGlob(fileName, join(root, pattern))) {
                    options = mapping;
                    break outer;
                }
            }
        }

        const text = snapshot.getText(0, snapshot.getLength());
        const processor = unified()
            .use(parse)
            .use(frontmatter)
            .use(mdc);

        const document = processor.parse(text);
        const frontmatters: Frontmatter[] = [];
        const expressions: Expression[] = [];

        visit(document, "yaml", (node) => {
            const root = parseDocument(node.value);
            frontmatters.push({
                root,
                offset: node.position!.start.offset!,
            });
        });

        visit(document, "containerComponent", (node: mdast.Parent & {
            name: string;
            rawData?: string;
        }) => {
            if (node.name !== "draft" || node.rawData === void 0) {
                return;
            }

            const root = parseDocument(node.rawData.slice(0, -"---".length));
            frontmatters.push({
                root,
                offset: node.position!.start.offset! + "::draft".length,
            });
        });

        visit(document, "heading", (node) => {
            if (node.depth !== 1) {
                return;
            }

            const start = node.position!.start.offset! + "# ".length;
            const end = node.position!.end.offset!;

            expressions.push({
                type: "slot",
                source: text.slice(start, end),
                offset: start,
            });
        });

        this.embeddedCodes.push(
            resolveCodes("frontmatter", "typescript", generateFrontmatter({
                import: options.frontmatter,
                frontmatters,
                expressions,
            })),
        );
    }
}

export function resolveCodes(id: string, languageId: string, generator: Generator<Code>) {
    const mappings: CodeMapping[] = [];

    let text = "";
    for (const code of generator) {
        if (typeof code === "string") {
            text += code;
        }
        else {
            const [source, offset, features] = code;
            const mapping: CodeMapping = {
                sourceOffsets: [offset],
                generatedOffsets: [text.length],
                lengths: [source.length],
                data: features,
            };
            mappings.push(mapping);
            text += source;
        }
    }

    const snapshot: ts.IScriptSnapshot = {
        getText: (start, end) => text.slice(start, end),
        getLength: () => text.length,
        getChangeRange: () => void 0,
    };

    return {
        id,
        languageId,
        snapshot,
        mappings,
    };
}
