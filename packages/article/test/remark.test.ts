import mdc from "remark-mdc";
import parse from "remark-parse";
import rehype from "remark-rehype";
import { type CompileResults, type Processor, unified } from "unified";
import { expect, it } from "vitest";
import compiler from "../src/remark/plugins/compiler";
import emoji from "../src/remark/plugins/emoji";
import frontmatter from "../src/remark/plugins/frontmatter";
import interpolation from "../src/remark/plugins/interpolation";
import ruby from "../src/remark/plugins/ruby";
import slot from "../src/remark/plugins/slot";
import type { Child, Element } from "../src/remark/types";

it("emoji", async () => {
    const processor = unified()
        .use(parse)
        .use(emoji)
        .use(rehype)
        .use(compiler);

    const { body } = await process(processor, `
        i-twemoji:face-with-monocle
    `);
    const children = tryGetChildren(body.children[0], "p");

    expect(children).toEqual([{
        type: "element",
        tag: "iconify",
        props: {
            className: ["emoji"],
            name: "i-twemoji:face-with-monocle",
        },
        children: [],
    }]);
});

it("ruby", async () => {
    const processor = unified()
        .use(parse)
        .use(ruby)
        .use(rehype)
        .use(compiler);

    const { body } = await process(processor, `
        |山吹风铃(やまぶき かざり)|
    `);
    const children = tryGetChildren(body.children[0], "p");

    expect(children).toEqual([{
        type: "element",
        tag: "ruby",
        props: {},
        children: [
            { type: "text", value: "山吹风铃" },
            {
                type: "element",
                tag: "rt",
                props: {},
                children: [
                    { type: "text", value: "やまぶき かざり" },
                ],
            },
        ],
    }]);
});

it("slot", async () => {
    const processor = unified()
        .use(parse)
        .use(frontmatter, {
            type: "yaml",
            fence: "---",
            fallthrough: true,
        })
        .use(mdc)
        .use(rehype)
        .use(slot);

    const { data } = await process(processor, `
        ::slots
        #foo
        #bar
        ::
    `);

    expect(data).toEqual({
        frontmatters: [{
            foo: [],
            bar: [],
        }],
    });
});

it("interpolation", async () => {
    const processor = unified()
        .use(parse)
        .use(frontmatter)
        .use(interpolation)
        .use(rehype)
        .use(compiler);

    const { body } = await process(processor, `
        ---
        foo:
          bar:
            - baz: ...
        ---
        [...] {{ foo.bar[0].baz }} [...]
    `);
    const children = tryGetChildren(body.children[0], "p");

    expect(children).toEqual([{
        type: "text",
        value: "[...] ... [...]",
    }]);
});

async function process<T extends CompileResults | undefined>(
    processor: Processor<any, any, any, any, T>,
    text: string,
) {
    text = text.split("\n").map((line) => line.slice(8)).join("\n").trim();
    const result = await processor.process(text);
    return {
        body: result.result as T,
        data: result.data,
    };
}

function tryGetChildren(node: Child, tag: string) {
    expect(node.type).equal("element");
    const el = node as Element;
    expect(el.tag).equal(tag);
    return el.children;
}
