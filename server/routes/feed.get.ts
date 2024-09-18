import type { H3Event } from "h3";
import { Feed } from "feed";
import { Article } from "~/utils/article";

export default defineEventHandler(async (event: H3Event) => {
    setHeaders(event, {
        "content-type": "application/xml",
        "cache-control": 60 * 15
    });

    const config = useRuntimeConfig();

    const feed = new Feed({
        id: "BikariArchive",
        title: "BikariArchive",
        copyright: "",
        link: `https://${config.public.domain}`,
        author: {
            name: "KazariEX"
        }
    });

    Object.values(Article.meta)
    .flatMap(({ chapters }) => chapters)
    .filter((c) => c.updateDate !== Article.FARAWAY)
    .sort((a, b) => {
        const x = a.updateDate
        const y = b.updateDate;
        return y.localeCompare(x);
    })
    .slice(0, 10)
    .forEach((c) => {
        feed.addItem({
            title: c.title,
            link: `https://${config.public.domain}/book/${c.novel}/${c.index}`,
            date: new Date(c.updateDate),
            published: new Date(c.publishDate)
        });
    });

    return feed.atom1();
});