import { readFile } from "node:fs/promises";
import defu from "defu";
import { createKerria, useLoad, useSource } from "kerria";
import { basename } from "pathe";
import { parseEntry } from "../remark";
import { isDevelopment } from "../utils";
import type { Child } from "../remark/types";
import type { EntryDetail, EntryTalent, JEntry } from "../types/entry";
import type { IntelNode } from "../types/intel";

interface AbilityInfo {
    name: string;
    star: number;
    class: string[];
}

interface AbilityItem {
    name: string;
    class: string[];
    owners: AbilityOwner[];
}

interface AbilityOwner {
    name: string;
    star: number;
}

enum SourceKind {
    Meta,
    Entry,
}

export default createKerria("Entry", () => {
    const metaInfo = useLoad("meta", {
        out: ".data/json/Intel.json",
        defaultValue: {
            blocks: [],
            all: {},
        },
        output(val) {
            const all: string[] = [];
            const drafts: string[] = [];
            for (const [name, draft] of Object.entries(val.all)) {
                (draft ? drafts : all).push(name);
            }

            const blocks = Object.entries<any>(structuredClone(val.blocks))
                .sort(([, { order: a }], [, { order: b }]) => a.localeCompare(b))
                .map(([abbr, block]) => (delete block.order, transform(block), { abbr, ...block }));

            return {
                blocks,
                all,
                drafts,
            };

            //在生产环境下隐藏未知标题，修剪草稿词条
            function transform(tree: IntelNode) {
                if (tree.unknown && !(isDevelopment && tree.title)) {
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
        },
    });

    const mapInfo = useLoad("map", {
        out: ".data/json/Intmap.json",
    });

    const abilityInfo = useLoad("ability", {
        out: ".data/json/Ability.json",
        output(val) {
            const items: Record<string, AbilityItem> = {};
            for (const [name, abilities] of Object.entries<AbilityInfo[]>(val)) {
                for (const ability of abilities) {
                    items[ability.name] ??= {
                        name: ability.name,
                        class: ability.class,
                        owners: [],
                    };
                    items[ability.name].owners.push({
                        name,
                        star: ability.star,
                    });
                }
            }
            return Object.values(items);
        },
    });

    useSource(SourceKind.Meta, {
        base: "data",
        folders: [
            "intel",
        ],
        ext: ".mdz",
        async parse(path) {
            //处理文件
            const file = await readFile(path, "utf-8");
            const { attributes } = await parseEntry<IntelNode>(file);
            const [order, abbr] = basename(path, ".mdz").split("-");

            //写入缓存
            return {
                order,
                abbr,
                data: attributes,
            };
        },
        cache(cache) {
            const { order, abbr, data } = cache;

            metaInfo.value.blocks[abbr] = {
                order,
                ...data,
            };
        },
        unlink(cache) {
            const { abbr } = cache;

            delete metaInfo.value.blocks[abbr];
        },
    });

    useSource(SourceKind.Entry, {
        base: "data",
        dist: ".data",
        folders: [
            "area",
            "character",
            "concept",
        ],
        ext: ".mdz",
        async parse(path, info) {
            //处理文件
            const file = await readFile(path, "utf-8");
            let { attributes, drafts } = await parseEntry<JEntry>(file);

            //生产环境下忽略草稿文件
            if (attributes.draft && !isDevelopment) {
                return null;
            }

            //合并草稿数据
            if (isDevelopment) {
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
            const folder = basename(info.folders.find((dir) => path.startsWith(dir))!);

            //提取超能力信息
            const abilities = collectAbilities(attributes.talents ?? []);

            //写入缓存
            return {
                name,
                folder,
                draft: attributes.draft,
                abilities,
            };
        },
        cache(cache) {
            const { name, folder, draft, abilities } = cache;

            metaInfo.value.all[name] = draft;
            mapInfo.value[name] = folder;
            abilityInfo.value[name] = abilities;
        },
        unlink(cache) {
            const { name } = cache;

            delete metaInfo.value.all[name];
            delete mapInfo.value[name];
            delete abilityInfo.value[name];
        },
    });
});

function transformDetails(attributes: JEntry) {
    const originals = attributes.details as unknown as Child[];
    if (!originals) {
        return;
    }

    const details: EntryDetail[] = [];
    let detail: EntryDetail | undefined;

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
                content: [],
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
            class: talent.class,
        });
    }
    return abilities;
}
