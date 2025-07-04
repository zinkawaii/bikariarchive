import { defineSitemapEventHandler } from "#imports";
import { Article } from "~/utils/article";
import { Entry } from "~/utils/entry";

export default defineSitemapEventHandler(() => {
    const config = useRuntimeConfig();

    return [
        "/about",
        "/borrowing",
        "/chest",
        "/compact",
        "/friend",
        "/home",
        "/intel",
        "/search",
        ...config.public.totalYears.map((year) => `/update/${year}`),
        "/tools/lyricaxis",
        "/tools/namaemaker",
        ...Object.entries(Article.meta).map(([novel, { chapters }]) => [
            `/book/${novel}`,
            ...chapters.map((item) => `/book/${novel}/${item.index}`),
        ]),
        ...Entry.meta.all,
    ].flat();
});
