import htmlTags from "html-tags";
import type { Root, RootContent } from "mdast";
import type { BlockComponent, InlineComponent } from "satorigear";
import { codeFeatures } from "./codeFeatures.ts";
import { generateFrontmatter } from "./generateFrontmatter.ts";
import { Boundary, capitalize, generateCamelized } from "./utils.ts";
import type { Code } from "../types.ts";

export interface CodegenOptions {
  name: string;
  source: string;
}

export function* generateRoot(root: Root, options: CodegenOptions): Generator<Code> {
  const upperName = capitalize(options.name);
  yield `type Frontmatter = import("@bikari/article").${upperName}Frontmatter;\n`;
  yield `let $frontmatter!: Required<Frontmatter>;\n`;
  yield `let $elements!:\n`;
  yield `  & HTMLElementTagNameMap\n`;
  yield `  & import("#build/article").Macros\n`;
  yield `  & typeof import("#build/article").components["global"]\n`;
  yield `  & typeof import("#build/article").components["${options.name}"];`;

  for (const node of root.children) {
    switch (node.type) {
      case "yaml": {
        yield* generateFrontmatter(node);
        break;
      }
      default: {
        yield* generateNode(node, options);
      }
    }
  }
}

function* generateNode(node: RootContent, options: CodegenOptions): Generator<Code> {
  switch (node.type) {
    case "yaml": {
      yield* generateFrontmatter(node, true);
      break;
    }
    case "blockComponent":
    case "inlineComponent": {
      if (node.name !== "span") {
        yield* generateComponent(node, options);
      }
      break;
    }
    case "heading": {
      if (node.depth === 1) {
        const start = node.position!.start.offset! + "# ".length;
        const end = node.position!.end.offset!;
        yield* generateExpression(start, end, options);
      }
      break;
    }
  }

  if ("children" in node) {
    for (const child of node.children) {
      yield* generateNode(child, options);
    }
  }
}

function* generateComponent(node: BlockComponent | InlineComponent, options: CodegenOptions): Generator<Code> {
  let nameStart = node.position!.start.offset!;
  while (options.source[nameStart] === ":") {
    nameStart++;
  }
  let nameEnd = nameStart + 1;
  while (!/[\s[{]/.test(options.source[nameEnd])) {
    nameEnd++;
  }
  const name = options.source.slice(nameStart, nameEnd);

  const boundary = yield* Boundary.start(nameStart, nameEnd, codeFeatures.verification);
  yield `$elements[`;
  const boundary2 = yield* Boundary.start(nameStart, nameEnd, codeFeatures.all);
  yield `"`;
  if (htmlTags.includes(name as any)) {
    yield [name, nameStart, codeFeatures.all];
  }
  else {
    yield* generateCamelized(capitalize(name), nameStart, codeFeatures.all);
  }
  yield `"`;
  yield boundary2.end();
  yield `]`;
  yield boundary.end();
  yield `;\n`;
}

function* generateExpression(start: number, end: number, options: CodegenOptions): Generator<Code> {
  yield `(`;
  const boundary = yield* Boundary.start(start, end, codeFeatures.verification);
  yield `$frontmatter.`;
  yield [
    options.source.slice(start, end),
    start,
    codeFeatures.all,
  ];
  yield `)`;
  yield boundary.end();
  yield `;\n`;
}
