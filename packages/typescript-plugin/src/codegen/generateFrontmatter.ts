import { type Node, parseDocument, Scalar, YAMLMap, YAMLSeq } from "yaml";
import type { Yaml } from "mdast";
import { codeFeatures } from "./codeFeatures.ts";
import { Boundary } from "./utils.ts";
import type { Code } from "../types.ts";

export function* generateFrontmatter(node: Yaml, partial = false): Generator<Code> {
  const document = parseDocument(node.value);
  const startOffset = node.position!.start.offset! + "---\n".length;

  yield `(): `;
  yield partial ? `Partial<Frontmatter>` : `Frontmatter`;
  yield ` => (`;
  for (const code of generateValue(document.contents)) {
    if (typeof code === "object") {
      code[1] += startOffset;
    }
    yield code;
  }
  yield `);\n`;
}

function* generateValue(node: Node | null): Generator<Code> {
  if (node === null) {
    yield `void 0`;
    return;
  }

  const boundary = yield* Boundary.start(node.range![0], node.range![1], codeFeatures.verification);

  if (node instanceof Scalar) {
    yield* generateScalar(node);
  }
  else if (node instanceof YAMLMap) {
    yield* generateMap(node);
  }
  else if (node instanceof YAMLSeq) {
    yield* generateSeq(node);
  }

  yield boundary.end();
}

function* generateScalar(node: Scalar): Generator<Code> {
  if (
    node.type === Scalar.QUOTE_SINGLE ||
    node.type === Scalar.QUOTE_DOUBLE ||
    !Number.isNaN(Number(node.value)) ||
    node.value === "true" ||
    node.value === "false" ||
    node.value === "null"
  ) {
    yield [
      JSON.stringify(node),
      node.range![0],
      codeFeatures.all,
    ];
  }
  else {
    const boundary = yield* Boundary.start(node.range![0], node.range![1], codeFeatures.verification);
    yield `"`;
    yield [
      node.toString(),
      node.range![0],
      codeFeatures.all,
    ];
    yield `"`;
    yield boundary.end();
  }
}

function* generateMap(node: YAMLMap): Generator<Code> {
  yield `{\n`;
  for (const item of node.items) {
    if (item.key instanceof Scalar) {
      yield [
        String(item.key.value),
        item.key.range![0],
        codeFeatures.all,
      ];
    }
    yield `: `;
    yield* generateValue(item.value as Node | null);
    yield `,\n`;
  }
  yield `}`;
}

function* generateSeq(node: YAMLSeq): Generator<Code> {
  yield `[\n`;
  for (const item of node.items) {
    yield* generateValue(item as Node | null);
    yield `,\n`;
  }
  yield `]`;
}
