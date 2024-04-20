import type { H3Event } from "h3";
import { Feed } from "feed";
import { jArticle } from "~/utils/Article";

const config = useRuntimeConfig();

export default defineNitroPlugin((nitroApp) => {
    nitroApp.router.get("/feed", defineEventHandler((event: H3Event) => {
        setHeader(event, "content-type", "application/xml");
        setHeader(event, "cache-control", 60 * 15);
        const feed = createFeed();
        return feed.atom1();
    }));
});

function createFeed() {
    const feed = new Feed({
        id: "BikariArchive",
        title: "BikariArchive",
        copyright: "",
        link: `https://${config.public.domain}`,
        author: {
            name: "KazariEX"
        }
    });

    Object.values(jArticle)
    .flatMap(({ chapters }) => chapters)
    .filter((c) => c.date)
    .sort((a, b) => {
        const x = a.updated || a.date;
        const y = b.updated || b.date;
        return y.localeCompare(x);
    })
    .slice(0, 10)
    .forEach((c) => {
        feed.addItem({
            title: c.title,
            link: `https://${config.public.domain}/book/${c.novel}/${c.index}`,
            date: new Date(c.updated || c.date),
            published: new Date(c.date)
        });
    });

    return feed;
}