import dot from "dot-object";
import fm from "front-matter";
import fs from "fs-extra";
import * as path from "path";
import Processor from "./processor";
import { entryMarked } from "../marked";

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
        src: "assets/json/Entry.json",
        out: "dist/json/Entry.json"
    },
    map: {
        out: "dist/json/Entrimap.json"
    },
    generate(filelist) {
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
    },
    parse(filename: string) {
        //处理文件
        const file = fs.readFileSync(filename);
        const { attributes, body } = fm<any>(file.toString());
        const result = entryMarked.parse(body) as any;

        for (const key in result) {
            dot.str(key, result[key], attributes);
        }

        //写入文件
        const outPath = filename.replace(this.sourceSrcDir, this.sourceOutDir).replace(".md", ".json");
        fs.outputFileSync(outPath, JSON.stringify(attributes));
    }
});