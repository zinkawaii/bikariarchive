import jArticle from "~~/dist/json/Article.json";

export default defineNuxtPlugin(() => {
    enrichJArticle(jArticle);
});