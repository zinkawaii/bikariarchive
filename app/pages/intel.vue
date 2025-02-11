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
        <section v-for="block in Entry.meta.blocks" class="intel-block">
            <div class="intel-header">
                <nuxt-img class="intel-icon" :src="block.icon" alt="[icon]"/>
                <span>{{ block.title }}</span>
            </div>
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
    .intel-block {
        display: flex;
        align-items: flex-start;
        gap: var(--meow-medium);
        margin-top: var(--meow-medium);

        @include viewport("md") {
            flex-direction: column;
            align-items: stretch;
        }
    }

    .intel-header {
        display: grid;
        justify-items: center;
        gap: 8px;
        margin-inline: auto;
        padding: 16px 24px 12px;
        border: 1px solid var(--color-border-lighter);
        border-left: 32px solid var(--color-theme);
        background-color: var(--color-background);
        font-family: var(--font-smooth);
    }

    .intel-icon {
        width: 100px;
        aspect-ratio: 1;
        border-radius: var(--bounded-circle);
        box-shadow: var(--box-shadow);
    }

    .intel-table {
        --font-size-td: 14px;

        flex: 1;
    }

    .entry-link {
        & + &::before {
            content: " • ";
        }
    }
</style>