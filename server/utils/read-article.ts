import fs from "fs-extra";
import Article from "~/utils/Article";
import jArtmap from "~/dist/json/Artmap.json";

export function readArticle(art: Article): Promise<string> {
    return new Promise((resolve, reject) => {
        const { novel, volume, index } = art;
        const filename = jArtmap[novel][index].name;
        const path = r(`dist/novel/${novel}.${volume}/${filename}.txt`);
        fs.readFile(path, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data.toString());
            }
        });
    });
}