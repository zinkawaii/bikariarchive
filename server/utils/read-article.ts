import fs from "fs-extra";
import { Article } from "~/utils/Article";

export async function readArticle(art: Article) {
    const { novel, volume, index } = art;
    const filename = Article.map[novel][index].name;
    const path = r(`/dist/novel/${novel}.${volume}/${filename}.txt`);
    const file = await fs.readFile(path);

    return file.toString();
}