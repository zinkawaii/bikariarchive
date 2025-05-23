import { defineSitemapEventHandler } from "#imports";
import { Article } from "~/utils/article";
import { Entry } from "~/utils/entry";

export default defineSitemapEventHandler(() => {
    return [
        "/about",
        "/borrowing",
        "/chest",
        "/compact",
        "/friend",
        "/home",
        "/intel",
        "/search",
        "/update",
        "/tools/lyricaxis",
        "/tools/namaemaker",
        ...Object.entries(Article.meta).map(([novel, { chapters }]) => [
            `/book/${novel}`,
            ...chapters.map((item) => `/book/${novel}/${item.index}`),
        ]),
        ...Entry.meta.all,
    ].flat();
});
