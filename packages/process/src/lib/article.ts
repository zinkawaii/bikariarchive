import * as path from "node:path";
import dayjs from "dayjs";
import fs from "fs-extra";
import $ from "node-html-parser";
import { isDev } from "@bikari/shared";
import { parseArticle } from "../remark";
import type { ArticleFrontMatter } from "../types";
import Processor from "./processor";

const re = /^(.*?)\.(\d+)$/;

export default new Processor({
    sign: "Article",
    source: {
        src: "data/novel",
        out: "dist/novel",
        pattern: "**/*.md"
    },
    meta: {
        src: "assets/json/Article.json",
        out: "dist/json/Article.json"
    },
    map: {
        out: "dist/json/Artmap.json"
    },
    async parse(filename) {
        //处理文件
        const file = await fs.readFile(filename);
        const { attributes, content } = await parseArticle<ArticleFrontMatter>(file.toString());

        //生产环境下忽略草稿文件
        if (attributes.draft && !isDev) return;

        //写入文件
        const outPath = filename.replace(this.sourceSrcDir, this.sourceOutDir).replace(".md", ".txt");
        await fs.outputFile(outPath, content);

        const match = path.basename(path.resolve(filename, "..")).match(re);
        const novel = match[1];
        const volume = Number(match[2]);
        const name = path.basename(filename, ".md");

        //解析内容
        const doc = $.parse(content);
        const runtime = doc.querySelectorAll("*").some((e) => e.tagName.includes("-")) || void 0;
        const wordCount = doc.querySelectorAll("p").reduce((res, p) => res + p.textContent.length, 0);

        //加密内容
        const password = String(attributes.password || "") || void 0;
        const encrypted = Boolean(password) || void 0;
        delete attributes.password;

        //日期格式化
        formatDate(attributes, ["date", "updated", "refactored"]);

        //生成映射
        let index = "";
        switch (this.jMeta[novel].type) {
            case "novel":
                index = name.match(/(.*?)-(.*)/)[2];
                break;
            case "blog":
                index = attributes.abbrlink;
                delete attributes.abbrlink;
                break;
        }
        this.jMap[novel][index] = {
            name,
            password
        };

        //写入数据
        this.jMeta[novel].chapters[name] = {
            index,
            volume,
            encrypted,
            runtime,
            wordCount,
            ...attributes
        };
    },
    beforeBuild(filelist) {
        for (const key in this.jMeta) {
            //编号与文件名的映射表
            this.jMap[key] = {};

            //章节对象集合
            this.jMeta[key].chapters = {};
        }

        //按字母顺序解析章节
        filelist.sort((a, b) => a.localeCompare(b));
    },
    beforeOutputMeta() {
        const jNeta = structuredClone(this.jMeta);
        for (const key in jNeta) {
            jNeta[key].chapters = Object.values(jNeta[key].chapters);
        }

        return jNeta;
    }
});

//日期格式化
function formatDate(obj, keys) {
    for (const key of keys) {
        if (Reflect.has(obj, key)) {
            obj[key] = dayjs(obj[key]).format("YYYY-MM-DD");
        }
    }
}