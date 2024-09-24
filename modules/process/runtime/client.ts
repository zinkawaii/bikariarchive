import jArticle from "~~/dist/json/Article.json";
import jIntel from "~~/dist/json/Intel.json";

export default defineNuxtPlugin(() => {
    enrichJArticle(jArticle);
    enrichJIntel(jIntel);

    if (import.meta.hot) {
        import.meta.hot.accept("../../../dist/json/Article.json", (mod) => {
            enrichJArticle(mod.default);
        });
        import.meta.hot.accept("../../../dist/json/Intel.json", (mod) => {
            enrichJIntel(mod.default);
        });
    }
});