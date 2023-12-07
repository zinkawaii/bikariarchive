import fs from "fs-extra";
import Article from "~/utils/Article";

export async function readArticle(art: Article): Promise<string> {
    return new Promise((resolve, reject) => {
        const { novel, volOrder, index } = art;
        const path = r(`dist/novel/${novel[0].toUpperCase() + novel.slice(1)}.${volOrder}/${index}.txt`);
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