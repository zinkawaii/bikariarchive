import articleJson from "#server/assets/json/article.json";
import intelJson from "#server/assets/json/intel.json";

const initialize = once(() => {
  enrichJArticle(articleJson as any);
  enrichJIntel(intelJson as any);
});

export default defineNuxtPlugin(() => {
  initialize();

  import.meta.hot?.accept("#server/assets/json/article.json", (mod) => {
    enrichJArticle(mod?.default);
  });
  import.meta.hot?.accept("#server/assets/json/intel.json", (mod) => {
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
