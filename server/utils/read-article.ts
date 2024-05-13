import fs from "fs-extra";
import jArtmap from "~/dist/json/Artmap.json";
import type { Article } from "~/utils/Article";

export async function readArticle(art: Article) {
    const { novel, volume, index } = art;
    const filename = jArtmap[novel][index].name;
    const path = r(`/dist/novel/${novel}.${volume}/${filename}.txt`);
    const file = await fs.readFile(path);

    return file.toString();
}