import { Article } from "#shared/utils/article";
import { Entry } from "#shared/utils/entry";
import { totalYears } from "~~/.data/json/update.json";

export default defineSitemapEventHandler(() => {
    return [
        "/",
        "/about",
        "/borrowing",
        "/compact",
        "/friend",
        "/intel",
        "/search",
        "/toolkit",
        "/toolkit/namaemaker",
        ...totalYears.map((year) => `/update/${year}`),
        ...Object.entries(Article.meta).map(([novel, { volumes, chapters }]) => [
            ...volumes.map((vol, i) => `/book/${novel}.${i}`),
            ...chapters.map((art) => ({
                loc: `/book/${novel}/${art.index}`,
                lastmod: art.updateDate !== Article.FARAWAY
                    ? art.updateDate
                    : void 0,
            })),
        ]),
        ...Object.keys(Entry.meta.entries),
    ].flat();
});
