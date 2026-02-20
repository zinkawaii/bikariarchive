import { randomBytes } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import * as p from "@clack/prompts";
import { dirname } from "pathe";
import { exec } from "tinyexec";
import YAML from "yaml";
import { resolveRoot } from "./utils";
import type { JArticle, JChapter } from "../../src/types/article";

export async function createArticle() {
    const path = resolveRoot("/.data/json/article.json");
    const meta = await readFile(path, "utf-8").then<JArticle>(JSON.parse);

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

        const path = resolveRoot(`/content/novel/${novel}.${volume}/` + fileName);
        const text = `---\n${YAML.stringify(frontmatter)}---\n`;

        if (existsSync(path)) {
            p.log.error(`文件 "${path}" 已存在！`);
        }
        else {
            await mkdir(dirname(path), { recursive: true });
            await writeFile(path, text);
        }

        await exec(`code-insiders`, [path]);
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
        fileName: `${order}-${index}.md`,
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

    const date = new Intl.DateTimeFormat("sv").format();
    const short = date.replaceAll("-", "").slice(2);
    const order = chapters.filter((chapter) => chapter.index.startsWith(short)).length;

    return {
        fileName: `${short + order}.md`,
        frontmatter: {
            title,
            abbrlink: randomBytes(4).toString("hex").slice(0, 7),
            date: {
                created: date,
            },
            draft: true,
        },
    };
}
