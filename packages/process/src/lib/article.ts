import { basename, resolve } from "node:path";
import dayjs from "dayjs";
import fs from "fs-extra";
import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";
import { isDev } from "@bikari/shared";
import { parseArticle } from "../remark";
import type { Element } from "../remark/types";
import type { ArticleFrontmatter } from "./types";
import Processor from "./processor";

const PATH_REGEX = /^(.*?)\.(\d+)$/;

export default new Processor({
    sign: "Article",
    source: {
        base: "data",
        dist: "dist",
        folders: [
            "novel"
        ],
        ext: ".mdz"
    },
    meta: {
        src: "app/assets/json/Article.json",
        out: "dist/json/Article.json"
    },
    map: {
        out: "dist/json/Artmap.json"
    },
    async parse(filename) {
        //处理文件
        const file = await fs.readFile(filename);
        const { attributes, body } = await parseArticle<ArticleFrontmatter>(file.toString());

        //生产环境下忽略草稿文件
        if (attributes.draft && !isDev) {
            return null;
        }

        //写入文件
        await this.outputJson(filename, body);

        //解析文件名
        const match = basename(resolve(filename, "..")).match(PATH_REGEX);
        const novel = match[1];
        const volume = Number(match[2]);
        const name = basename(filename, ".mdz");

        //解析内容
        let wordCount = 0;
        visit<any, any>(body, "element", (node: Element) => {
            if (node.tag === "p") {
                wordCount += toString(node).length;
            }
        });

        //加密内容
        const password = String(attributes.password || "") || void 0;
        const encrypted = Boolean(password) || void 0;
        delete attributes.password;

        //日期格式化
        formatDate(attributes, ["date", "updated", "refactored"]);

        //生成映射
        let order = `[${volume}]`;
        let index = "";
        switch (this.jMeta[novel].type) {
            case "novel":
                const match = name.match(/^(.*?)-(.*)$/);
                order += match[1];
                index = match[2];
                break;
            case "blog":
                order += name;
                index = attributes.abbrlink;
                delete attributes.abbrlink;
                break;
        }

        //写入数据
        const data = {
            index,
            volume,
            encrypted,
            wordCount,
            ...attributes
        };

        //写入缓存
        return {
            name,
            order,
            novel,
            data
        };
    },
    unlink(cache) {
        const { order, novel, data } = cache;
        const { index } = data;

        delete this.jMeta[novel].chapters[order];
        delete this.jMap[novel][index];
    },
    onCacheHit(cache) {
        const { order, name, novel, data } = cache;
        const { index, password } = data;

        this.jMeta[novel].chapters[order] = data;
        this.jMap[novel][index] = {
            name,
            password
        };
    },
    beforeBuild() {
        for (const novel in this.jMeta) {
            //编号与文件名的映射表
            this.jMap[novel] = {};

            //章节对象集合
            this.jMeta[novel].chapters = {};
        }
    },
    beforeOutputMeta() {
        const jMeta = structuredClone(this.jMeta);
        for (const key in jMeta) {
            jMeta[key].chapters = Object.entries(jMeta[key].chapters)
                .toSorted(([a], [b]) => a.localeCompare(b))
                .map(([_, c]) => c);
        }
        return jMeta;
    }
});

//日期格式化
function formatDate(obj: object, keys: string[]) {
    for (const key of keys) {
        if (Reflect.has(obj, key)) {
            obj[key] = dayjs(obj[key]).format("YYYY-MM-DD");
        }
    }
}