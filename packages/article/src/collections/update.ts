import { readFile } from "node:fs/promises";
import { createKerria, useLoad, useSource } from "kerria";
import { basename } from "pathe";
import { parseUpdate } from "../remark";
import type { JUpdate } from "../types/update";

const prefixRE = /^([-\w]+)(?:\(([-\w]+)\))?:/;

export default createKerria("Update", () => {
    const meta = useLoad("update", {
        dist: ".data/json/update.json",
        defaultValue: {
            totalYears: new Set(),
        },
        output(val) {
            return {
                totalYears: [...val.totalYears].sort().reverse(),
            };
        },
    });

    useSource(0, {
        base: "content",
        dist: ".data",
        folders: [
            "update",
        ],
        ext: ".md",
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
                    const [text, span] = node.children;
                    if (text.type !== "text" || span.type !== "element" || span.children[0]?.type !== "text") {
                        continue;
                    }

                    update = {
                        date: text.value.trim(),
                        version: span.children[0].value.slice(1),
                        items: [],
                    };
                    updates.push(update);
                }
                else if (node.tag === "p") {
                    const child = node.children[0];
                    if (child?.type !== "text") {
                        continue;
                    }

                    const match = child.value.match(prefixRE);
                    if (!match) {
                        continue;
                    }

                    child.value = child.value.slice(match[0].length).trimStart();

                    update?.items.push({
                        type: match[1],
                        scope: match[2],
                        content: node.children,
                    });
                }
            }

            //写入文件
            await info.output(path, updates);

            return {
                year: Number(basename(path, ".md")),
            };
        },
        cache(cache) {
            meta.value.totalYears.add(cache.year);
        },
        unlink(cache) {
            meta.value.totalYears.delete(cache.year);
        },
    });
});
