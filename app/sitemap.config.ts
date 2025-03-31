import type { ModuleOptions } from "@nuxtjs/sitemap";
import jArticle from "../dist/json/Article.json";
import jIntel from "../dist/json/Intel.json";

export default <ModuleOptions> {
    excludeAppSources: true,
    urls: () => [
        "/about",
        "/borrowing",
        "/chest",
        "/compact",
        "/friend",
        "/home",
        "/intel",
        "/search",
        "/update",
        "/tools/excalc",
        "/tools/lyricaxis",
        "/tools/namaemaker",
        ...Object.entries(jArticle).map(([novel, { chapters }]) => [
            `/book/${novel}`,
            ...chapters.map((item) => `/book/${novel}/${item.index}`)
        ]),
        ...jIntel.all
    ].flat()
};