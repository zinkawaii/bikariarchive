import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import * as p from "@clack/prompts";
import { format } from "date-fns";
import { customAlphabet } from "nanoid";
import { dirname } from "pathe";
import YAML from "yaml";
import { $ } from "zx";
import { resolveRoot } from "./utils.ts";
import type { JArticle, JChapter } from "../src/types/article";

export async function createArticle() {
    const path = resolveRoot("/.data/json/Article.json");
    const file = await readFile(path, "utf-8");
    const meta = JSON.parse(file) as JArticle;

    const novels = Object.entries(meta).map(([id, info]) => ({ label: info.title, value: id }));

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
    const chapters = novelInfo.chapters.filter((chapter) => chapter.volume === volume);

    const returns = await create(chapters);
    if (returns) {
        const { fileName, frontmatter } = returns;

        const path = resolveRoot(`/data/novel/${novel}.${volume}/` + fileName);
        const text = `---\n${YAML.stringify(frontmatter)}---\n`;

        if (existsSync(path)) {
            p.log.error(`文件 "${path}" 已存在！`);
        }
        else {
            await mkdir(dirname(path), { recursive: true });
            await writeFile(path, text);
        }

        await $`code-insiders ${path}`;
    }
}

async function createNovel(chapters: JChapter[]) {
    const recents = chapters.slice(-3).map((chapter) => chapter.index).reverse();

    const index = await p.text({
        message: "章节索引：",
        placeholder: recents + ",...",
    });

    if (p.isCancel(index)) {
        return;
    }

    const title = await p.text({
        message: "章节标题：",
        defaultValue: "",
    });

    if (p.isCancel(title)) {
        return;
    }

    const order = String(chapters.length).padStart(2, "0");

    return {
        fileName: `${order}-${index}.mdz`,
        frontmatter: {
            title,
            draft: true,
        },
    };
}

async function createBlog(chapters: JChapter[]) {
    const title = await p.text({
        message: "章节标题：",
        defaultValue: "",
    });

    if (p.isCancel(title)) {
        return;
    }

    const now = new Date();
    const date = format(now, "yyMMdd");
    const order = chapters.filter((chapter) => chapter.index.startsWith(date)).length;

    return {
        fileName: `${date + order}.mdz`,
        frontmatter: {
            title,
            abbrlink: createAbbrlink(),
            date: {
                created: format(now, "yyyy-MM-dd"),
            },
            draft: true,
        },
    };
}

function createAbbrlink() {
    const nanoid = customAlphabet("0123456789abcdef", 7);
    return nanoid();
}
