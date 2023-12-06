<script setup>
    import jEntry from "~/assets/json/Entry.json";

    useHead({
        title: "情报"
    });
</script>

<template>
    <div class="content-group">
        <div v-for="block in jEntry.blocks" class="detail-block">
            <div class="detail-header">
                <nuxt-img class="detail-image" :src="block.icon"/>
                <span>{{ block.title }}</span>
            </div>
            <div class="navbox-wrapper detail-table">
                <table>
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
                                        <span v-for="title in z.children" class="detail-link">
                                            <nuxt-link
                                                v-if="(typeof title) === `object`"
                                                :to="toEntry(title[0])"
                                            >{{ title[1] }}</nuxt-link>
                                            <nuxt-link
                                                v-else
                                                :to="toEntry(title)"
                                            >{{ title }}</nuxt-link>
                                        </span>
                                    </td>
                                </tr>
                            </template>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .detail-block {
        display: flex;
        align-items: flex-start;
        gap: 32px;

        & + & {
            margin-top: 32px;
        }
    }

    .detail-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 16px 24px 12px;
        border: 1px solid var(--color-border-light);
        border-left: 32px solid var(--color-theme-block);
        background-color: var(--color-background);
        font-weight: bold;
    }

    .detail-image {
        width: 100px;
        height: 100px;
        border-radius: 100%;
        box-shadow: 4px 4px 12px rgb(0 0 0 / 24%);
    }

    .detail-table {
        flex: 1;

        > table {
            min-width: 616px;
        }

        th {
            text-wrap: nowrap;
        }
    }

    .detail-link {
        & + & {
            &::before {
                content: " • ";
            }
        }
    }

    @media (width < 1024px) {
        .detail-block {
            gap: 16px;
        }
    }

    @container main (width < 768px) {
        .detail-block {
            flex-direction: column;
            align-items: stretch;
        }
    }
</style>