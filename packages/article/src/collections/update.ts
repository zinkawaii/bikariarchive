import { readFile } from "node:fs/promises";
import { createKerria, useSource } from "kerria";
import { parseUpdate } from "../remark";
import type { JUpdate } from "../types/update";

const titleRE = /^(.+) \[v(.+)\]$/;
const prefixRE = /^([-\w]+)(?:\(([-\w]+)\))?:/;

export default createKerria("Update", () => {
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
            let update: JUpdate | undefined;

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

                    const match = firstNode.value.match(titleRE);
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

                    const match = firstNode.value.match(prefixRE);
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
