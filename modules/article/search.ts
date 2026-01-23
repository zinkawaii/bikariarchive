import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import consola from "consola";
import { toString } from "mdast-util-to-string";
import type { Child, JArticle, JArtmap, Root } from "../../packages/article/src";

export async function buildSearch() {
    const meta = JSON.parse(await readFile(".data/json/Article.json", "utf-8")) as JArticle;
    const map = JSON.parse(await readFile(".data/json/Artmap.json", "utf-8")) as JArtmap;

    const data: Record<string, Record<string, number[][]>> = {};

    for (const [novel, info] of Object.entries(meta)) {
        for (const chapter of info.chapters) {
            if (chapter.encrypted) {
                continue;
            }

            const path = `.data/novel/${novel}.${chapter.volume}/${map[novel][chapter.index].name}.json`;
            const root = JSON.parse(await readFile(path, "utf-8")) as Root;

            for (const [char, vector] of forEachVector(root)) {
                ((data[char] ??= {})[`${novel}/${chapter.index}`] ??= []).push(vector);
            }
        }
    }

    await rm(".data/search", { recursive: true, force: true });

    for (const [char, vectors] of Object.entries(data)) {
        const code = char.codePointAt(0)!.toString();

        await mkdir(`.data/search/${code.slice(0, 2)}`, { recursive: true });
        await writeFile(`.data/search/${code.slice(0, 2)}/${code}.json`, JSON.stringify(vectors));
    }

    consola.success("[Search] Build");
}

function* forEachVector(node: Root | Child, vector: number[] = []): Generator<[string, number[]]> {
    if (node.type === "element" && node.tag === "p") {
        const text = toString(node);
        for (let i = 0; i < text.length; i++) {
            yield [text[i], [...vector, i]];
        }
    }
    else if (node.type !== "text") {
        for (let i = 0; i < node.children.length; i++) {
            yield* forEachVector(node.children[i], [...vector, i]);
        }
    }
}
