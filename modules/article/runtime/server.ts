import { readFile } from "node:fs/promises";
import chokidar from "chokidar";
import { basename } from "pathe";
import { Article, enrichJArticle } from "#shared/utils/article";
import { enrichJIntel, Entry } from "#shared/utils/entry";

export default defineNitroPlugin(async (nitroApp) => {
    const baseDir = r("/.data/json");
    const list = [
        "article",
        "artmap",
        "intel",
        "intmap",
    ].map((name) => `${baseDir}/${name}.json`);

    for (const path of list) {
        await update(path);
    }

    if (import.meta.dev) {
        const watcher = chokidar.watch(list).on("change", update);
        nitroApp.hooks.hook("close", () => watcher.close());
    }
});

async function update(path: string) {
    const name = basename(path, ".json");
    const file = await readFile(path, "utf-8");
    const data = JSON.parse(file);
    switch (name) {
        case "article": {
            enrichJArticle(data);
            break;
        }
        case "artmap": {
            Article.map = data;
            break;
        }
        case "intel": {
            enrichJIntel(data);
            break;
        }
        case "intmap": {
            Entry.map = data;
            break;
        }
    }
}
