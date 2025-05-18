import { readFile } from "node:fs/promises";
import { createProcessor, useSource } from "kerria";
import { parseUpdate } from "../remark";
import type { JUpdate } from "./types";

const TITLE_REGEX = /^(.+) \[v(.+)\]$/;
const PREFIX_REGEX = /^([-\w]+)(?:\(([-\w]+)\))?:/;

export default createProcessor("Update", () => {
    useSource(0, {
        base: "data",
        dist: ".data",
        folders: [
            "update",
        ],
        ext: ".mdz",
        async parse(path, info) {
            //处理文件
            const file = await readFile(path, "utf-8");
            const body = await parseUpdate(file);

            const updates: JUpdate[] = [];
            let update: JUpdate;

            for (let i = 0; i < body.children.length; i++) {
                const node = body.children[i];

                if (node.type !== "element") {
                    continue;
                }
                else if (node.tag === "h2") {
                    if (node.children.length !== 1) {
                        continue;
                    }

                    const firstNode = node.children[0];
                    if (firstNode.type !== "text") {
                        continue;
                    }

                    const match = firstNode.value.match(TITLE_REGEX);
                    if (!match) {
                        continue;
                    }

                    update = {
                        date: match[1],
                        version: match[2],
                        items: [],
                    };
                    updates.push(update);
                }
                else if (node.tag === "p") {
                    const firstNode = node.children[0];
                    if (firstNode?.type !== "text") {
                        continue;
                    }

                    const match = firstNode.value.match(PREFIX_REGEX);
                    if (!match) {
                        continue;
                    }

                    firstNode.value = firstNode.value.slice(match[0].length).trimStart();

                    update?.items.push({
                        type: match[1],
                        scope: match[2],
                        content: node.children,
                    });
                }
            }

            //写入文件
            await info.output(path, updates);
        },
    });
});
