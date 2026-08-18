/// <reference types="@volar/typescript" />

import { type CodeMapping, forEachEmbeddedCode, type LanguagePlugin, type VirtualCode } from "@volar/language-core";
import { computed, signal } from "alien-signals";
import { dirname, join, matchesGlob } from "pathe";
import { createParser, type Document, type TextEdit } from "satorigear";
import { visit } from "unist-util-visit";
import { parseDocument } from "yaml";
import type { Root } from "mdast";
import type ts from "typescript";
import { generateFrontmatters } from "./codegen/generateFrontmatters.ts";
import type { Code, Config, Expression, Frontmatter, Mapping } from "./types.ts";

interface Context {
  root: string;
  config: Config;
}

const parser = createParser({
  features: {
    attributes: true,
    binding: true,
    component: true,
    footnote: true,
    frontmatter: true,
    math: true,
    strikethrough: true,
    table: true,
  },
});

export function createLanguagePlugin(
  compilerOptions: ts.CompilerOptions,
  config: Config,
): LanguagePlugin<string, MdzVirtualCode> {
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
        return new MdzVirtualCode(uri, snapshot, context);
      }
    },
    updateVirtualCode(uri, virtualCode, snapshot) {
      virtualCode.update(snapshot);
      return virtualCode;
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
  mappings: CodeMapping[] = [];
  snapshot: ts.IScriptSnapshot;
  get embeddedCodes() {
    return this.#embeddedCodes();
  }

  #embeddedCodes: () => VirtualCode[];
  #document: Document;
  #root: {
    (): Root;
    (value: Root): void;
  };

  constructor(fileName: string, snapshot: ts.IScriptSnapshot, context: Context) {
    this.snapshot = snapshot;

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
    this.#document = parser.createDocument(text);
    this.#root = signal(this.#document.snapshot());

    this.#embeddedCodes = computed(() => {
      const root = this.#root();
      const text = this.snapshot.getText(0, this.snapshot.getLength());

      const frontmatters: Frontmatter[] = [];
      const expressions: Expression[] = [];

      visit(root, "yaml", (node) => {
        const root = parseDocument(node.value);
        frontmatters.push({
          root,
          offset: node.position!.start.offset!,
        });
      });

      visit(root, "heading", (node) => {
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

      return [
        resolveCodes("document", "typescript", generateFrontmatters({
          import: options.frontmatter,
          frontmatters,
          expressions,
        })),
      ];
    });
  }

  update(snapshot: ts.IScriptSnapshot) {
    const change = snapshot.getChangeRange(this.snapshot);
    this.snapshot = snapshot;

    if (change) {
      const edit: TextEdit = {
        start: change.span.start,
        end: change.span.start + change.span.length,
        text: snapshot.getText(change.span.start, change.span.start + change.newLength),
      };
      this.#document.edit([edit]);
      this.#root(this.#document.snapshot());
    }
    else {
      const text = snapshot.getText(0, snapshot.getLength());
      this.#document = parser.createDocument(text);
      this.#root(this.#document.snapshot());
    }
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
