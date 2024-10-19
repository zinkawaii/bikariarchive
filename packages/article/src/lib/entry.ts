import { basename } from "node:path";
import fs from "fs-extra";
import { parseEntry } from "../remark";
import Processor from "./processor";
import type { JEntry } from "./types";

export default new Processor({
    sign: "Entry",
    source: {
        base: "data",
        dist: "dist",
        folders: [
            "area",
            "character",
            "concept"
        ],
        ext: ".mdz"
    },
    meta: {
        src: "app/assets/json/Intel.json",
        out: "dist/json/Intel.json"
    },
    map: {
        out: "dist/json/Intmap.json"
    },
    async parse(filename) {
        //处理文件
        const file = await fs.readFile(filename);
        const attributes = await parseEntry<JEntry>(file.toString());

        //写入文件
        await this.outputJson(filename, attributes);

        //写入数据
        const name = basename(filename, ".mdz");
        const folder = basename(this.sourceFolders.find((dir) => filename.startsWith(dir)));

        //写入缓存
        return {
            name,
            folder
        };
    },
    unlink(cache) {
        const { name } = cache;

        delete this.jMeta.all[name];
        delete this.jMap[name];
    },
    onCacheHit(cache) {
        const { name, folder } = cache;

        this.jMeta.all[name] = true;
        this.jMap[name] = folder;
    },
    onMetaUpdate(newVal, oldVal) {
        newVal.all = oldVal.all;
        return newVal;
    },
    beforeBuild() {
        this.jMeta.all = {};
    },
    beforeOutputMeta() {
        const jMeta = structuredClone(this.jMeta);
        jMeta.all = Object.keys(jMeta.all);

        return jMeta;
    }
});