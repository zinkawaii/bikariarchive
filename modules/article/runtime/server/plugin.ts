import { definePlugin } from "nitro";
import articleJson from "#content/data/article.json";
import intelJson from "#content/data/intel.json";

export default definePlugin(() => {
  enrichJArticle(articleJson as any);
  enrichJIntel(intelJson as any);

  import.meta.hot?.accept("#content/data/article.json", (mod) => {
    enrichJArticle(mod?.default);
  });
  import.meta.hot?.accept("#content/data/intel.json", (mod) => {
    enrichJIntel(mod?.default);
  });
});
