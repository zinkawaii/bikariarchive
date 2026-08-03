import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import consola from "consola";
import { toString } from "mdast-util-to-string";
import { basename, dirname } from "pathe";
import { glob } from "tinyglobby";
import type { Child, JArticle, JArtmap, Root } from "@bikari/article";

export async function buildSearch() {
  const meta = await readFile(".data/json/article.json", "utf-8").then<JArticle>(JSON.parse);
  const map = await readFile(".data/json/artmap.json", "utf-8").then<JArtmap>(JSON.parse);

  const data: Record<string, Record<string, number[][]>> = {};

  for (const [novel, info] of Object.entries(meta)) {
    for (const chapter of info.chapters) {
      if (chapter.encrypted) {
        continue;
      }

      const path = `.data/novel/${novel}.${chapter.volume}/${map[novel][chapter.index].name}.json`;
      const root = await readFile(path, "utf-8").then<Root>(JSON.parse);

      for (const [char, vector] of forEachVector(root)) {
        ((data[char] ??= {})[`${novel}/${chapter.index}`] ??= []).push(vector);
      }
    }
  }

  await Promise.all(
    await glob(".data/search/**/*.json", { absolute: true }).then(
      (paths) => paths
        .filter((path) => !(String.fromCodePoint(+basename(path, ".json")) in data))
        .map((path) => rm(path)),
    ),
  );

  await Promise.all(
    Object.entries(data).map(async ([char, vectors]) => {
      const code = char.codePointAt(0)!.toString();
      const path = `.data/search/${code.slice(0, 2)}/${code}.json`;
      const text = JSON.stringify(vectors);

      const stats = await stat(path).catch(() => void 0);
      if (!stats || stats.size !== text.length) {
        await mkdir(dirname(path), { recursive: true });
        await writeFile(path, text);
      }
    }),
  );

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
