import { readFile } from "node:fs/promises";
import chokidar from "chokidar";
import { basename } from "pathe";
import { Article, enrichJArticle } from "~/utils/article";
import { enrichJIntel, Entry } from "~/utils/entry";

export default defineNitroPlugin(async () => {
    const baseDir = r("/data/dist/json");
    const list = [
        "Article",
        "Artmap",
        "Intel",
        "Intmap",
    ].map((name) => baseDir + `/${name}.json`);

    for (const path of list) {
        await update(path);
    }

    if (import.meta.dev) {
        const watcher = chokidar.watch(list, {});
        watcher.on("change", update);
    }
});

async function update(path: string) {
    const name = basename(path, ".json");
    const file = await readFile(path, "utf-8");
    const data = JSON.parse(file);
    switch (name) {
        case "Article": {
            enrichJArticle(data);
            break;
        }
        case "Artmap": {
            Article.map = data;
            break;
        }
        case "Intel": {
            enrichJIntel(data);
            break;
        }
        case "Intmap": {
            Entry.map = data;
            break;
        }
    }
}
