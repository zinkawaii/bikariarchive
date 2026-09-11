import chokidar from "chokidar";
import { definePlugin } from "nitro";
import { useStorage } from "nitro/storage";
import { basename, resolve } from "pathe";
import { Article, enrichJArticle } from "#shared/utils/article";
import { enrichJIntel } from "#shared/utils/entry";

export default definePlugin(async (nitroApp) => {
  const storage = useStorage("assets:data");
  const list = [
    "json/article.json",
    "json/artmap.json",
    "json/intel.json",
  ];

  for (const path of list) {
    await update(path);
  }

  if (import.meta.dev) {
    const watcher = chokidar
      .watch(list.map((path) => resolve(`.data/${path}`)))
      .on("change", (path) => update(`json/${basename(path)}`));
    nitroApp.hooks.hook("close", () => watcher.close());
  }

  async function update(path: string) {
    const name = basename(path, ".json");
    const data = await storage.getItem(path) as any;
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
    }
  }
});
