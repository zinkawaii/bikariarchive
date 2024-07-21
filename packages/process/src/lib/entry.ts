import * as path from "node:path";
import fs from "fs-extra";
import { parseEntry } from "../remark";
import type { JEntry } from "../types";
import Processor from "./processor";

const folders = [
    "area",
    "character",
    "concept"
];

export default new Processor({
    sign: "Entry",
    source: {
        src: "data",
        out: "dist",
        pattern: `{${folders.join(",")}}/*.md`
    },
    meta: {
        src: "app/assets/json/Entry.json",
        out: "dist/json/Entry.json"
    },
    map: {
        out: "dist/json/Entrimap.json"
    },
    async parse(filename) {
        //处理文件
        const file = await fs.readFile(filename);
        const attributes = await parseEntry<JEntry>(file.toString());

        //约束类型
        const { appearance } = attributes;
        if (appearance) {
            appearance.index = String(appearance.index);
        }

        //写入文件
        const outPath = filename.replace(this.sourceSrcDir, this.sourceOutDir).replace(".md", ".json");
        await fs.outputJson(outPath, attributes);
    },
    beforeBuild(filelist) {
        this.jMeta.all = [];

        for (const filename of filelist) {
            const name = path.basename(filename, ".md");
            this.jMeta.all.push(name);

            for (const folder of folders) {
                if (filename.includes(folder)) {
                    this.jMap[name] = folder;
                    break;
                }
            }
        }
    }
});