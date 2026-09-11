import { type Document, type Node, Scalar, YAMLMap, YAMLSeq } from "yaml";
import { codeFeatures } from "./codeFeatures.ts";
import { Boundary } from "./utils.ts";
import type { Code, Expression, Frontmatter } from "../types.ts";

export interface FrontmatterCodegenOptions {
  name: string;
  frontmatters: Frontmatter[];
  expressions: Expression[];
}

export function* generateFrontmatters(options: FrontmatterCodegenOptions): Generator<Code> {
  const upperName = options.name[0]?.toUpperCase() + options.name.slice(1);
  yield `type Frontmatter = import("@bikari/article").${upperName}Frontmatter;\n`;
  yield `let $frontmatter!: Required<Frontmatter>;\n`;

  for (let i = 0; i < options.frontmatters.length; i++) {
    const { root, offset } = options.frontmatters[i];
    const startOffset = offset + 4;

    for (const code of generateFrontmatter(options, root, i)) {
      if (typeof code === "object") {
        code[1] += startOffset;
      }
      yield code;
    }
  }

  for (const exp of options.expressions) {
    yield* generateExpression(exp);
  }
}

function* generateFrontmatter(options: FrontmatterCodegenOptions, root: Document, index: number): Generator<Code> {
  yield `(): `;
  yield* generateReturnType(index, options.expressions);
  yield ` => (`;
  yield* generateValue(root.contents);
  yield `);\n`;
}

function* generateReturnType(index: number, expressions: Expression[]): Generator<Code> {
  if (index) {
    yield `Partial<Frontmatter>`;
    return;
  }

  const attrs = expressions
    .filter(({ type, source }) => type === "slot" && !(source.includes(".") || source.includes("[")))
    .map(({ source }) => `"${source}"`);

  if (attrs.length) {
    yield `Omit<Frontmatter, `;
    yield attrs.join(" | ");
    yield `>`;
  }
  else {
    yield `Frontmatter`;
  }
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

function* generateExpression(exp: Expression): Generator<Code> {
  const { source, offset } = exp;
  yield `(`;
  const boundary = yield* Boundary.start(offset, offset + source.length, codeFeatures.verification);
  yield `$frontmatter.`;
  yield [
    source,
    offset,
    codeFeatures.all,
  ];
  yield `)`;
  yield boundary.end();
  yield `;\n`;
}
