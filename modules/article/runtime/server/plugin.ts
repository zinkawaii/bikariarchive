import { definePlugin } from "nitro";
import { useKV } from "nitro/kv";
import { basename } from "pathe";
import { Article, enrichJArticle } from "#shared/utils/article";
import { enrichJIntel } from "#shared/utils/entry";

export default definePlugin(async (nitroApp) => {
  const storage = useKV("assets:content");
  const list = [
    "data/article.json",
    "data/artmap.json",
    "data/intel.json",
  ];

  for (const path of list) {
    await update(path);
  }

  if (import.meta.dev) {
    const dispose = await storage.watch((event, key) => {
      if (list.includes(key) && event === "update") {
        update(key);
      }
    });
    nitroApp.hooks.hook("close", dispose);
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
