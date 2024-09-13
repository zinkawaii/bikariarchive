import * as path from "node:path";
import fs from "fs-extra";
import { parseEntry } from "../remark";
import type { JEntry } from "./types";
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
        pattern: `{${folders.join(",")}}/*.mdz`
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

        //写入文件
        const outPath = filename.replace(this.sourceSrcDir, this.sourceOutDir).replace(".mdz", ".json");
        await fs.outputJson(outPath, attributes);

        //写入数据
        const name = path.basename(filename, ".mdz");
        const folder = folders.find((folder) => filename.includes(folder));
        this.jMeta.all.add(name);
        this.jMap[name] = folder;

        //写入缓存
        return {
            name,
            folder
        };
    },
    unlink(cache) {
        const { name } = cache;

        this.jMeta.all.delete(name);
        delete this.jMap[name];
    },
    onCacheHit(cache) {
        const { name, folder } = cache;

        this.jMeta.all.add(name);
        this.jMap[name] = folder;
    },
    beforeBuild() {
        this.jMeta.all = new Set();
    },
    beforeOutputMeta() {
        const jMeta = structuredClone(this.jMeta);
        jMeta.all = [...jMeta.all];

        return jMeta;
    },
});