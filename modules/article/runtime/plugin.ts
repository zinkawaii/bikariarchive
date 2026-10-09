import articleJson from "#content/data/article.json";
import intelJson from "#content/data/intel.json";

const initialize = once(() => {
  enrichJArticle(articleJson as any);
  enrichJIntel(intelJson as any);
});

export default defineNuxtPlugin(() => {
  initialize();

  import.meta.hot?.accept("#content/data/article.json", (mod) => {
    enrichJArticle(mod?.default);
  });
  import.meta.hot?.accept("#content/data/intel.json", (mod) => {
    enrichJIntel(mod?.default);
  });
});

function once(func: () => void) {
  let called = false;
  return () => {
    if (called && import.meta.server) {
      return;
    }
    called = true;
    func();
  };
}
