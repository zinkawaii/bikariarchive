import fs from "fs-extra";
import { basename } from "pathe";
import { parseEntry } from "../remark";
import Processor from "./processor";
import type { Child } from "../remark/types";
import type { EntryDetail, JEntry } from "./types";

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
        src: "data/json/Intel.json",
        out: "dist/json/Intel.json"
    },
    map: {
        out: "dist/json/Intmap.json"
    },
    async parse(filename) {
        //处理文件
        const file = await fs.readFile(filename);
        const attributes = await parseEntry<JEntry>(file.toString());

        //转换数据
        transformDetails(attributes);

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

function transformDetails(attributes: JEntry) {
    const originals = attributes.details as unknown as Child[];
    if (!originals) {
        return;
    }

    const details: EntryDetail[] = [];
    let detail: EntryDetail;

    for (let i = 0; i < originals.length; i++) {
        const node = originals[i];

        if (node.type === "element" && node.tag === "h2") {
            if (node.children.length !== 1) {
                continue;
            }

            const firstNode = node.children[0];
            if (firstNode.type !== "text") {
                continue;
            }

            detail = {
                title: firstNode.value,
                content: []
            };
            details.push(detail);
        }
        else {
            detail?.content.push(node);
        }
    }
    attributes.details = details;
}