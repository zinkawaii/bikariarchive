import chokidar from "chokidar";
import dayjs from "dayjs";
import fm from "front-matter";
import fs from "fs-extra";
import $ from "node-html-parser";
import * as glob from "glob";
import * as path from "path";
import marked from "./marked";
import { r } from "../utils";
import { isDev, timer } from "@bikari/shared";

const srcDir = r("data/novel");
const outDir = r("dist/novel");

const metaSrcDir = r("assets/json/Article.json");
const metaOutDir = r("dist/json/Article.json");
const mapOutDir = r("dist/json/Artmap.json");

const jMeta = JSON.parse(fs.readFileSync(metaSrcDir));
const jMap = {};

const re = /^(.*?)\.(\d+)$/;

export default {
    async build() {
        await timer("Article", generateMetaInfo)();
    },
    watch() {
        const parse = timer("Article", (pathname) => {
            simpleParse(pathname);
            outputFile();
        });

        chokidar.watch([`${srcDir}/**/*.md`])
        .on("change", parse);
    }
};

//单文件解析
function simpleParse(pathname) {
    //转绝对路径
    pathname = path.resolve(pathname);

    //处理文件
    const file = fs.readFileSync(pathname);
    const { attributes, body } = fm(file.toString());

    //生产环境下忽略草稿文件
    if (attributes.draft && !isDev) return;
    const result = marked.parse(body);

    //写入文件
    const outPath = pathname.replace(srcDir, outDir).replace(".md", ".txt");
    fs.outputFileSync(outPath, result);

    const match = path.basename(path.resolve(pathname, "..")).match(re);
    const novel = match[1];
    const volume = Number(match[2]);
    const filename = path.basename(pathname, ".md");

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
    switch (jMeta[novel].type) {
        case "novel":
            index = filename.match(/(.*?)-(.*)/)[2];
            break;
        case "blog":
            index = attributes.abbrlink;
            delete attributes.abbrlink;
            break;
    }
    jMap[novel][index] = filename;

    //写入数据
    jMeta[novel].chapters[pathname] = {
        index,
        volume,
        runtime,
        wordCount,
        ...attributes
    };
}

//从元信息和Front Matter生成全文和Article.json
function generateMetaInfo() {
    const filelist = glob.globSync(`${srcDir}/**/*.md`);

    for (const key in jMeta) {
        //编号与文件名的映射表
        jMap[key] = {};

        //章节对象集合
        jMeta[key].chapters = {};
    }

    //按字母顺序解析章节
    filelist.sort((a, b) => a.localeCompare(b)).forEach(simpleParse);

    outputFile();
}

//输出到文件
function outputFile() {
    const jNeta = structuredClone(jMeta);

    for (const key in jNeta) {
        jNeta[key].chapters = Object.values(jNeta[key].chapters);
    }

    fs.outputFileSync(metaOutDir, JSON.stringify(jNeta));
    fs.outputFileSync(mapOutDir, JSON.stringify(jMap));
}

//日期格式化
function dateFormat(obj, keys) {
    keys.forEach((key) => {
        if (Reflect.has(obj, key)) {
            obj[key] = dayjs(obj[key]).format("YYYY-MM-DD");
        }
    });
}