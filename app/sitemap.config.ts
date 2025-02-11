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
        "/shelf",
        "/update",
        "/tools/excalc",
        "/tools/lyricaxis",
        "/tools/namaemaker",
        ...Object.entries(jArticle).map(([novel, { chapters }]) => {
            return chapters.map((item) => {
                return `/book/${novel}/${item.index}`;
            });
        }),
        ...jIntel.all
    ].flat()
};