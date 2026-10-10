import { definePlugin } from "nitro";
import { useKV } from "nitro/kv";
import { Article, enrichJArticle } from "#shared/utils/article";
import { enrichJIntel } from "#shared/utils/entry";

export default definePlugin(async (nitroApp) => {
  const storage = useKV("assets:content");
  const list = [
    "data:article.json",
    "data:artmap.json",
    "data:intel.json",
  ];

  if (import.meta.dev) {
    const key = Symbol.for("@bikari/article:unwatch");
    const registry = globalThis as any as {
      [key]?: Promise<() => unknown>;
    };

    const awaiter = registry[key] ?? Promise.resolve();
    registry[key] = awaiter.then((unwatch) => {
      unwatch?.();
      return storage.watch((event, key) => {
        if (list.includes(key) && event === "update") {
          update(key);
        }
      });
    });
    nitroApp.hooks.hook("close", storage.unwatch);
  }

  for (const path of list) {
    await update(path);
  }

  async function update(key: string) {
    const name = key.slice("data:".length, -".json".length);
    const data = await storage.getItem(key) as any;
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
