<script lang="ts" setup>
    import jEntry from "~~/dist/json/Entry.json";

    useHead({
        title: "情报"
    });
</script>

<template>
    <coco-widget title="情报">
        <div v-for="block in jEntry.blocks" class="detail-block">
            <div class="detail-header">
                <nuxt-img class="detail-icon" :src="block.icon" alt="[icon]"/>
                <span>{{ block.title }}</span>
            </div>
            <coco-table class="detail-table">
                <colgroup>
                    <col width="15%"/>
                    <col width="20%"/>
                    <col />
                </colgroup>
                <tbody>
                    <template v-for="x in block.children">
                        <tr>
                            <th colspan="3">{{ x.title }}</th>
                        </tr>
                        <template v-for="y in x.children">
                            <tr v-for="(z, i) in y.children">
                                <th v-if="i === 0" :rowspan="y.children.length">{{ y.title }}</th>
                                <th>{{ z.title }}</th>
                                <td>
                                    <entry-link v-for="title in z.children" :title/>
                                </td>
                            </tr>
                        </template>
                    </template>
                </tbody>
            </coco-table>
        </div>
    </coco-widget>
</template>

<style lang="scss" scoped>
    .detail-block {
        display: flex;
        align-items: flex-start;
        gap: var(--cw-medium);
        margin-top: var(--cw-medium);

        @include viewport("md") {
            flex-direction: column;
            align-items: stretch;
        }
    }

    .detail-header {
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

    .detail-icon {
        width: 100px;
        aspect-ratio: 1;
        border-radius: var(--bounded-circle);
        box-shadow: 4px 4px 12px rgb(0 0 0 / 24%);
    }

    .detail-table {
        flex: 1;

        th {
            text-wrap: nowrap;
        }
    }

    .detail-link {
        & + &::before {
            content: " • ";
        }
    }
</style>