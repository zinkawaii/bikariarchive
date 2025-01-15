import { isDev } from "@bikari/shared";
import defu from "defu";
import fs from "fs-extra";
import { basename } from "pathe";
import { parseEntry } from "../remark";
import { createProcessor, useLoad, useSource } from "./processor";
import type { Child } from "../remark/types";
import type { EntryDetail, EntryTalent, IntelNode, JEntry, JIntel } from "./types";

interface AbilityInfo {
    name: string;
    star: number;
    class: string[];
}

export default createProcessor("Entry", () => {
    const metaInfo = useLoad("meta", {
        src: "data/json/Intel.json",
        out: "dist/json/Intel.json",
        onUpdate(newVal, oldVal) {
            newVal.all = oldVal.all;
            return newVal;
        },
        beforeOutput(val) {
            const all = [];
            const drafts = [];
            for (const [name, draft] of Object.entries(val.all)) {
                (draft ? drafts : all).push(name);
            }

            const newVal = structuredClone(val) as JIntel;
            for (const block of newVal.blocks) {
                transform(block);
            }

            return {
                ...newVal,
                all,
                drafts
            };

            //在生产环境下隐藏未知标题，修剪草稿词条
            function transform(tree: IntelNode) {
                if (tree.unknown && !(isDev && tree.title)) {
                    tree.title = "? ? ?";
                }

                for (let i = 0; i < tree.children.length; i++) {
                    let item = tree.children[i] as IntelNode | string | string[];
                    if (typeof item === "object" && !Array.isArray(item)) {
                        transform(item);
                        if (!item.children.length) {
                            tree.children.splice(i--, 1);
                        }
                        continue;
                    }
                    if (Array.isArray(item)) {
                        item = item[0];
                    }
                    if (!(item in val.all)) {
                        tree.children.splice(i--, 1);
                    }
                }
            }
        }
    });
    metaInfo.value.all = {};

    const mapInfo = useLoad("map", {
        out: "dist/json/Intmap.json"
    });

    const abilityInfo = useLoad("ability", {
        out: "dist/json/Ability.json",
        onUpdate(newVal, oldVal) {
            newVal.items = oldVal.items;
            return newVal;
        },
        beforeOutput(val) {
            const items = [];
            for (const [name, abilities] of Object.entries<AbilityInfo[]>(val)) {
                if (!(name in metaInfo.value.all)) {
                    continue;
                }
                for (const ability of abilities) {
                    let item = items.find(({ name }) => name === ability.name);
                    if (!item) {
                        items.push(item = {
                            name: ability.name,
                            class: ability.class,
                            owners: []
                        });
                    }
                    item.owners.push({
                        name,
                        star: ability.star
                    });
                }
            }
            return items;
        }
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
            let { attributes, drafts } = await parseEntry<JEntry>(file.toString());

            //生产环境下忽略草稿文件
            if (attributes.draft && !isDev) {
                return null;
            }

            //合并草稿数据
            if (isDev) {
                for (const draft of drafts) {
                    attributes = defu(draft, attributes);
                }
            }

            //转换数据
            transformDetails(attributes);

            //写入文件
            await info.output(path, attributes);

            //写入数据
            const name = basename(path, ".mdz");
            const folder = basename(info.folders.find((dir) => path.startsWith(dir)));

            //提取超能力信息
            const abilities = collectAbilities(attributes.talents ?? []);

            //写入缓存
            return {
                name,
                folder,
                draft: attributes.draft,
                abilities
            };
        },
        unlink(cache) {
            const { name } = cache;

            delete metaInfo.value.all[name];
            delete mapInfo.value[name];
            delete abilityInfo.value[name];
        },
        onCacheHit(cache) {
            const { name, folder, draft, abilities } = cache;

            metaInfo.value.all[name] = draft;
            mapInfo.value[name] = folder;
            abilityInfo.value[name] = abilities;
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

function collectAbilities(talents: EntryTalent[]) {
    const abilities: AbilityInfo[] = [];
    for (const talent of talents) {
        if (talent.type !== "超能力") {
            continue;
        }

        abilities.push({
            name: talent.name.zh,
            star: talent.star,
            class: talent.class
        });
    }
    return abilities;
}