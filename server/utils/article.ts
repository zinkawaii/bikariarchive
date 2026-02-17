import { readFile } from "node:fs/promises";
import type { Root } from "@bikari/article";
import { Article } from "#shared/utils/article";

export function readArticle(art: Article) {
    const { novel, volume, index } = art;
    const filename = Article.map[novel][index].name;
    const path = r(`/.data/novel/${novel}.${volume}/${filename}.json`);
    return readFile(path, "utf-8").then<Root>(JSON.parse);
}
