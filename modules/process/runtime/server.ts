import { basename } from "node:path";
import chokidar from "chokidar";
import fs from "fs-extra";
import { Article, enrichJArticle } from "~/utils/Article";

export default defineNitroPlugin(async () => {
    const baseDir = r("/dist/json");
    const list = [
        baseDir + "/Article.json",
        baseDir + "/Artmap.json"
    ];

    for (const path of list) {
        await update(path);
    }

    if (import.meta.dev) {
        chokidar.watch(list)
        .on("change", update);
    }

    async function update(path: string) {
        const name = basename(path, ".json");
        const data = await fs.readJson(path);
        switch (name) {
            case "Article": {
                enrichJArticle(data);
                break;
            }
            case "Artmap": {
                Article.map = data;
                break;
            }
        }
    }
});