import { Feed } from "feed";
import { toString } from "mdast-util-to-string";
import type { H3Event } from "h3";
import { Article } from "~/utils/article";

export default defineEventHandler(async (event: H3Event) => {
    setHeaders(event, {
        "content-type": "application/xml",
        "cache-control": 60 * 15,
    });

    const config = useRuntimeConfig();

    const feed = new Feed({
        id: "BikariArchive",
        title: "BikariArchive",
        copyright: "© 2022-2024 KazariEX",
        favicon: `https://${config.public.domain}/garden/favicon.ico`,
        link: `https://${config.public.domain}`,
        author: {
            name: "KazariEX",
        },
    });

    const arts = Object.values(Article.meta)
    .flatMap(({ chapters }) => chapters)
    .filter((c) => c.updateDate !== Article.FARAWAY)
    .sort((a, b) => {
        const x = a.updateDate;
        const y = b.updateDate;
        return y.localeCompare(x);
    })
    .slice(0, 10);

    for (const art of arts) {
        const description = toString(art.excerpt);
        const link = `https://${config.public.domain}/book/${art.novel}/${art.index}`;
        const content = `${
            art.cover ? `<img src="${art.cover.src}">` : ""
        }<p>${description}</p><a href="${link}">查看原文</a>`;

        feed.addItem({
            title: art.title,
            description,
            link,
            date: new Date(art.updateDate),
            published: new Date(art.publishDate),
            content,
        });
    }

    return feed.atom1();
});
