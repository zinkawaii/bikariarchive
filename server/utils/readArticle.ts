import fs from "fs-extra";
import type { Root } from "@bikari/article";
import { Article } from "~/utils/article";

export async function readArticle(art: Article) {
    const { novel, volume, index } = art;
    const filename = Article.map[novel][index].name;
    const path = r(`/dist/novel/${novel}.${volume}/${filename}.json`);

    return await fs.readJSON(path) as Root;
}
