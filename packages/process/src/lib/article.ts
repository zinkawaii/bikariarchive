import dayjs from "dayjs";
import fm from "front-matter";
import fs from "fs-extra";
import $ from "node-html-parser";
import * as path from "path";
import Processor from "./processor";
import { articleMarked } from "../marked";
import type { FrontMatter } from "../types";
import { isDev } from "@bikari/shared";

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
    generate(filelist) {
        for (const key in this.jMeta) {
            //编号与文件名的映射表
            this.jMap[key] = {};

            //章节对象集合
            this.jMeta[key].chapters = {};
        }

        //按字母顺序解析章节
        return filelist.sort((a, b) => a.localeCompare(b));
    },
    parse(filename) {
        //处理文件
        const file = fs.readFileSync(filename);
        const { attributes, body } = fm<FrontMatter>(file.toString());

        //生产环境下忽略草稿文件
        if (attributes.draft && !isDev) return;
        const result = articleMarked.parse(body) as string;

        //写入文件
        const outPath = filename.replace(this.sourceSrcDir, this.sourceOutDir).replace(".md", ".txt");
        fs.outputFileSync(outPath, result);

        const match = path.basename(path.resolve(filename, "..")).match(re);
        const novel = match[1];
        const volume = Number(match[2]);
        const name = path.basename(filename, ".md");

        //解析内容
        const doc = $.parse(result);
        const runtime = doc.querySelectorAll("*").some((e) => e.tagName.includes("-"));
        const wordCount = doc.querySelectorAll("p").reduce((res, p) => {
            return res + p.textContent.length;
        }, 0);

        //日期格式化
        dateFormat(attributes, ["date", "updated", "refactored"]);

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
        this.jMap[novel][index] = name;

        //写入数据
        this.jMeta[novel].chapters[name] = {
            index,
            volume,
            runtime,
            wordCount,
            ...attributes
        };
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
function dateFormat(obj, keys) {
    keys.forEach((key) => {
        if (Reflect.has(obj, key)) {
            obj[key] = dayjs(obj[key]).format("YYYY-MM-DD");
        }
    });
}