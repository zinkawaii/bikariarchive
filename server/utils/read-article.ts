import fs from "fs-extra";
import type Article from "~/utils/Article";
import jArtmap from "~/dist/json/Artmap.json";

export function readArticle(art: Article) {
    return new Promise<string>((resolve, reject) => {
        const { novel, volume, index } = art;
        const filename = jArtmap[novel][index].name;
        const path = r(`/dist/novel/${novel}.${volume}/${filename}.txt`);
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