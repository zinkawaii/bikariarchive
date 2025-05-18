import jArticle from "~~/.data/json/Article.json";
import jIntel from "~~/.data/json/Intel.json";

export default defineNuxtPlugin(() => {
    enrichJArticle(jArticle as any);
    enrichJIntel(jIntel as any);

    if (import.meta.hot) {
        import.meta.hot.accept("../../../.data/json/Article.json", (mod) => {
            enrichJArticle(mod?.default);
        });
        import.meta.hot.accept("../../../.data/json/Intel.json", (mod) => {
            enrichJIntel(mod?.default);
        });
    }
});
