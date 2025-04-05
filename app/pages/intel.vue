<script lang="ts" setup>
    import type { IntelItem, IntelLeaf } from "@bikari/article";

    useHead({
        title: "情报"
    });

    const [DefineIntelCell, IntelCell] = createReusableTemplate<IntelItem>();

    function isIntelLeaf(leaf: IntelLeaf | IntelItem): leaf is IntelLeaf {
        return leaf.children[0]?.toString() === "[object Object]";
    }
</script>

<template>
    <define-intel-cell v-slot="{ $slots, children }">
        <component :is="$slots.default"/>
        <td>
            <entry-link v-for="title in children" :title/>
        </td>
    </define-intel-cell>
    <meow-widget title="情报">
        <section v-for="block in Entry.meta.blocks" class="intel-section">
            <h2 :id="block.title" class="intel-header">
                <span class="intel-abbr">{{ block.abbr.toUpperCase() }}</span>
                <span class="intel-title">{{ block.title }}</span>
            </h2>
            <meow-table class="intel-table">
                <colgroup>
                    <col width="15%"/>
                    <col width="20%"/>
                    <col />
                </colgroup>
                <tbody>
                    <template v-for="branch in block.children">
                        <tr>
                            <th colspan="3">{{ branch.title }}</th>
                        </tr>
                        <template v-for="leaf in branch.children">
                            <template v-if="isIntelLeaf(leaf)">
                                <tr v-for="(item, i) in leaf.children">
                                    <intel-cell v-bind="item">
                                        <th v-if="i === 0" :rowspan="leaf.children.length">{{ leaf.title }}</th>
                                        <th>{{ item.title }}</th>
                                    </intel-cell>
                                </tr>
                            </template>
                            <tr v-else>
                                <intel-cell v-bind="leaf">
                                    <th colspan="2">{{ leaf.title }}</th>
                                </intel-cell>
                            </tr>
                        </template>
                    </template>
                </tbody>
            </meow-table>
        </section>
    </meow-widget>
</template>

<style lang="scss" scoped>
    .intel-section {
        &:hover .intel-abbr {
            color: var(--color-info);
        }
    }

    .intel-header {
        --edge-fades-to: right;

        display: grid;
        justify-content: center;
        justify-items: center;
        position: relative;
        overflow-x: clip;
        margin-block: 24px 16px;
        animation-name: edge-fades;
        animation-timeline: view();
    }

    .intel-abbr {
        opacity: 0.5;
        margin-block: -8px -32px;
        mask: linear-gradient(black 33%, transparent);
        font-size: 64px;
        color: transparent;
        transition: color 0.25s;
        -webkit-text-stroke: 1px var(--color-info);
    }

    .intel-title {
        isolation: isolate;
    }

    .intel-table {
        --font-size-td: 14px;
    }

    .entry-link {
        & + &::before {
            content: " • ";
        }
    }
</style>