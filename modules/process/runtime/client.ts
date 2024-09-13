import jArticle from "~~/dist/json/Article.json";
import jIntel from "~~/dist/json/Intel.json";

export default defineNuxtPlugin(() => {
    enrichJArticle(jArticle);
    enrichJIntel(jIntel);
});