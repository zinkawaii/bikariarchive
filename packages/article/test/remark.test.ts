import raw from "rehype-raw";
import frontmatter from "remark-frontmatter";
import mdc from "remark-mdc";
import parse from "remark-parse";
import rehype from "remark-rehype";
import { type Processor, unified } from "unified";
import { expect, it } from "vitest";
import { ruby } from "../src/remark";
import attributes from "../src/remark/plugins/attributes";
import compiler from "../src/remark/plugins/compiler";
import emoji from "../src/remark/plugins/emoji";
import interpolation from "../src/remark/plugins/interpolation";
import slot from "../src/remark/plugins/slot";
import type { Child, Element, Root } from "../src/remark/types";

it("emoji", async () => {
    const processor = unified()
        .use(parse)
        .use(emoji)
        .use(rehype)
        .use(raw)
        .use(compiler);

    const body = await getBody(processor, `
i-twemoji:face-with-monocle
    `);
    const children = tryGetChildren(body.children[0], "p");

    expect(children).toEqual([{
        type: "element",
        tag: "iconify",
        props: {
            className: ["emoji"],
            name: "i-twemoji:face-with-monocle"
        },
        children: []
    }]);
});

it("ruby", async () => {
    const processor = unified()
        .use(parse)
        .use(ruby)
        .use(rehype)
        .use(raw)
        .use(compiler);

    const body = await getBody(processor, `
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
                    { type: "text", value: "やまぶき かざり" }
                ]
            }
        ]
    }]);
});

it("slot", async () => {
    const processor = unified()
        .use(parse)
        .use(mdc)
        .use(rehype)
        .use(raw)
        .use(slot);

    const body = await getBody(processor, `
::slots
#foo
#bar
::
    `);

    expect(body.children).toEqual([
        { tag: "foo", children: [] },
        { tag: "bar", children: [] }
    ]);
});

it("interpolation", async () => {
    const processor = unified()
        .use(parse)
        .use(frontmatter)
        .use(attributes)
        .use(interpolation)
        .use(rehype)
        .use(raw)
        .use(compiler);

    const body = await getBody(processor, `---
foo:
  bar:
    - baz: ...
---
[...] {{ foo.bar[0].baz }} [...]
    `);
    const children = tryGetChildren(body.children[0], "p");

    expect(children).toEqual([{
        type: "text",
        value: "[...] ... [...]"
    }]);
});

async function getBody(processor: Processor<any, any, any, any, any>, text: string) {
    const result = await processor.process(text);
    return result.result as Root;
}

function tryGetChildren(node: Child, tag: string) {
    expect(node.type).equal("element");
    const el = node as Element;
    expect(el.tag).equal(tag);
    return el.children;
}