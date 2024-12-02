import fs from "fs-extra";
import { basename } from "pathe";
import { parseEntry } from "../remark";
import { createProcessor, useLoad, useSource } from "./processor";
import type { Child } from "../remark/types";
import type { EntryDetail, JEntry } from "./types";

export default createProcessor("Entry", () => {
    const metaInfo = useLoad("meta", {
        src: "data/json/Intel.json",
        out: "dist/json/Intel.json",
        onUpdate(newVal, oldVal) {
            newVal.all = oldVal.all;
            return newVal;
        },
        beforeOutput(val) {
            const newVal = structuredClone(val);
            newVal.all = Object.keys(newVal.all);
            return newVal;
        }
    });
    metaInfo.value.all = {};

    const mapInfo = useLoad("map", {
        out: "dist/json/Intmap.json"
    });

    useSource(0, {
        base: "data",
        dist: "dist",
        folders: [
            "area",
            "character",
            "concept"
        ],
        ext: ".mdz",
        async parse(path, info) {
            //处理文件
            const file = await fs.readFile(path);
            const attributes = await parseEntry<JEntry>(file.toString());

            //转换数据
            transformDetails(attributes);

            //写入文件
            await info.output(path, attributes);

            //写入数据
            const name = basename(path, ".mdz");
            const folder = basename(info.folders.find((dir) => path.startsWith(dir)));

            //写入缓存
            return {
                name,
                folder
            };
        },
        unlink(cache) {
            const { name } = cache;

            delete metaInfo.value.all[name];
            delete mapInfo.value[name];
        },
        onCacheHit(cache) {
            const { name, folder } = cache;

            metaInfo.value.all[name] = true;
            mapInfo.value[name] = folder;
        }
    });
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