import { readFile } from "node:fs/promises";
import * as p from "@clack/prompts";
import { format } from "date-fns";
import { customAlphabet } from "nanoid";
import type { JArticle, JNovel } from "@bikari/article";
import { defineCreator, resolveRoot } from "./utils.ts";

const createNovel = defineCreator(async (novelInfo: JNovel, novel: string, volume: number) => {
    const recents = novelInfo.chapters.slice(-3).map((chapter) => chapter.index).reverse();

    const index = await p.text({
        message: "章节索引：",
        placeholder: recents + ",...",
    });

    if (p.isCancel(index)) {
        return;
    }

    const chapters = novelInfo.chapters.filter((chapter) => chapter.volume === volume);
    const order = String(chapters.length).padStart(2, "0");

    return {
        fileName: `/data/novel/${novel}.${volume}/${order}-${index}.mdz`,
        frontmatter: {
            title: await p.text({
                message: "文章标题：",
                defaultValue: "",
            }),
            draft: true,
        },
    };
});

const createBlog = defineCreator(async (novelInfo: JNovel, novel: string, volume: number) => {
    const now = new Date();
    const date = format(now, "yyMMdd");
    const order = novelInfo.chapters.filter((chapter) => chapter.index.startsWith(date)).length;

    return {
        fileName: `/data/novel/${novel}.${volume}/${date + order}.mdz`,
        frontmatter: {
            title: await p.text({
                message: "文章标题：",
                defaultValue: "",
            }),
            abbrlink: createAbbrlink(),
            date: {
                created: format(now, "yyyy-MM-dd"),
            },
            draft: true,
        },
    };
});

export async function createArticle() {
    p.intro("新建文章");

    const path = resolveRoot("/.data/json/Article.json");
    const text = await readFile(path, "utf-8");
    const meta = JSON.parse(text) as JArticle;

    const novels = Object.entries(meta).map(([k, v]) => ({ label: v.title, value: k }));

    const novel = await p.select({
        options: novels,
        message: "选择书籍：",
    });

    if (p.isCancel(novel)) {
        return;
    }

    const novelInfo = meta[novel];
    const volumes = novelInfo.volumes.map((volume, i) => ({ label: volume.title, value: i }));

    if (novelInfo.type === "novel") {
        volumes.reverse();
    }

    const volume = await p.select({
        options: volumes,
        message: "选择卷册：",
    });

    if (p.isCancel(volume)) {
        return;
    }

    const create = novelInfo.type === "novel" ? createNovel : createBlog;
    await create(novelInfo, novel, volume);
}

function createAbbrlink() {
    const nanoid = customAlphabet("0123456789abcdef", 7);
    return nanoid();
}
