import { type Node, Scalar, YAMLMap, YAMLSeq } from "yaml";
import { codeFeatures } from "./codeFeatures";
import type { Code, Expression, Frontmatter, Import } from "../types";

export interface FrontmatterCodegenOptions {
    import: Import;
    frontmatters: Frontmatter[];
    expressions: Expression[];
}

interface FrontmatterCodegenContext {
    startOffset: number;
}

export function* generateFrontmatter(options: FrontmatterCodegenOptions): Generator<Code> {
    const ctx: FrontmatterCodegenContext = {
        startOffset: 0,
    };

    if (options.import.length) {
        yield `type Frontmatter = import("${options.import[0]}").${options.import[1]};\n`;
    }
    yield `let $frontmatter!: Required<Frontmatter>;\n`;

    for (let i = 0; i < options.frontmatters.length; i++) {
        const { root, offset } = options.frontmatters[i];
        ctx.startOffset = offset + 4;

        yield `(): `;
        yield* generateReturnType(i, options.expressions);
        yield ` => (`;
        yield* generateValue(ctx, root.contents, false);
        yield `);\n`;
    }

    for (const exp of options.expressions) {
        yield* generateExpression(exp);
    }
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

function* generateValue(
    ctx: FrontmatterCodegenContext,
    node: Node | null,
    trailingComma: boolean,
): Generator<Code> {
    if (node) {
        yield [
            ``,
            node.range![0] + ctx.startOffset,
            codeFeatures.verification,
        ];
    }
    if (!node) {
        yield `void 0`;
    }
    else if (node instanceof Scalar) {
        yield* generateScalar(ctx, node);
    }
    else if (node instanceof YAMLMap) {
        yield* generateMap(ctx, node);
    }
    else if (node instanceof YAMLSeq) {
        yield* generateSeq(ctx, node);
    }
    if (node) {
        yield [
            ``,
            node.range![1] + ctx.startOffset,
            codeFeatures.verification,
        ];
    }
    if (trailingComma) {
        yield `,\n`;
    }
}

function* generateScalar(ctx: FrontmatterCodegenContext, node: Scalar): Generator<Code> {
    let start = ctx.startOffset;
    let quote = true;

    if (node.type === Scalar.QUOTE_SINGLE || node.type === Scalar.QUOTE_DOUBLE) {
        start++;
    }
    else if (
        !Number.isNaN(Number(node.value)) ||
        node.value === "true" ||
        node.value === "false" ||
        node.value === "null"
    ) {
        quote = false;
    }

    if (quote) {
        yield `"`;
    }
    yield [
        String(node.value),
        start + ctx.startOffset,
        codeFeatures.all,
    ];
    if (quote) {
        yield `"`;
    }
}

function* generateMap(ctx: FrontmatterCodegenContext, node: YAMLMap): Generator<Code> {
    yield `{\n`;
    for (const item of node.items) {
        if (item.key instanceof Scalar) {
            yield [
                String(item.key.value),
                item.key.range![0] + ctx.startOffset,
                codeFeatures.all,
            ];
        }
        yield `: `;
        yield* generateValue(ctx, item.value as Node | null, false);
        yield `,\n`;
    }
    yield `}`;
}

function* generateSeq(ctx: FrontmatterCodegenContext, node: YAMLSeq): Generator<Code> {
    yield `[\n`;
    for (const item of node.items) {
        yield* generateValue(ctx, item as Node | null, true);
    }
    yield `]`;
}

function* generateExpression(exp: Expression): Generator<Code> {
    const { source, offset } = exp;
    yield `(`;
    yield [
        ``,
        offset,
        codeFeatures.verification,
    ];
    yield `$frontmatter.`;
    yield [
        source,
        offset,
        codeFeatures.all,
    ];
    yield `)`;
    yield [
        ``,
        offset + source.length,
        codeFeatures.verification,
    ];
    yield `;\n`;
}
