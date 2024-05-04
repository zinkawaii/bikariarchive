import type { ModuleOptions } from "@nuxtjs/sitemap";
import jArticle from "../dist/json/Article.json";
import jEntry from "../dist/json/Entry.json";

export default <ModuleOptions> {
    excludeAppSources: true,
    urls: () => [
        "/about",
        "/borrowing",
        "/catalogue",
        "/compact",
        "/details",
        "/friend",
        "/home",
        "/search",
        "/update",
        "/tools/excalc",
        "/tools/lyricaxis",
        "/tools/namaemaker",
        ...Object.entries(jArticle).map(([novel, { chapters }]) => {
            return chapters.map((item) => {
                return `/book/${novel}/${item.index}`;
            });
        }),
        ...Object.values(jEntry.all)
    ].flat(1)
};