import { toString } from "mdast-util-to-string";
import { createFeed, generateAtom1 } from "zfeed";
import type { H3Event } from "h3";
import { Article } from "~/utils/article";

export default defineEventHandler(async (event: H3Event) => {
    setHeaders(event, {
        "content-type": "application/xml",
        "cache-control": 60 * 15,
    });

    const config = useRuntimeConfig();
    const currentDate = new Date();

    const arts = Object.values(Article.meta)
    .flatMap(({ chapters }) => chapters)
    .filter((c) => c.updateDate !== Article.FARAWAY)
    .sort((a, b) => {
        const x = a.updateDate;
        const y = b.updateDate;
        return y.localeCompare(x);
    })
    .slice(0, 10);

    const feed = createFeed({
        id: "BikariArchive",
        title: config.public.title,
        description: config.public.description,
        link: `https://${config.public.domain}`,
        feed: `https://${config.public.domain}/feed`,
        language: "zh-CN",
        generator: "https://github.com/KazariEX/zfeed",
        image: `https://${config.public.domain}${config.public.avatar}`,
        favicon: `https://${config.public.domain}${config.public.favicon}`,
        copyright: `© 2022-${currentDate.getFullYear()} KazariEX`,
        updatedAt: new Date(arts[0].updateDate),
        author: {
            name: "KazariEX",
        },
        items: arts.map((art) => {
            const description = toString(art.excerpt);
            const link = `https://${config.public.domain}/book/${art.novel}/${art.index}`;
            const content = `${
                art.cover ? `<img src="${art.cover.src}">` : ""
            }<p>${description}</p><a href="${link}">查看原文</a>`;

            return {
                title: art.title,
                description,
                link,
                updatedAt: new Date(art.updateDate),
                publishedAt: new Date(art.publishDate),
                content,
            };
        }),
    });

    return generateAtom1(feed);
});
