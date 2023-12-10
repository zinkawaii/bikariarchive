import jArticle from "../dist/json/Article.json";
import jEntry from "../assets/json/Entry.json";

export default {
    excludeAppSources: true,
    urls: () => [
        "/borrowing",
        "/catalogue",
        "/details",
        "/friend",
        "/home",
        "/search",
        "/tools/excalc",
        "/tools/lyricaxis",
        "/tools/namaemaker",
        "/user/login",
        "/user/logon",
        ...Object.entries(jArticle).map(([novel, { chapter }]) => {
            return chapter.map((item) => {
                return `/book/${novel}/${item.index}`;
            });
        }),
        ...Object.values(jEntry.category)
    ].flat(1)
};