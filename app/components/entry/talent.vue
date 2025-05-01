<script lang="ts" setup>
    import type { EntryTalent } from "@bikari/article";

    defineProps<{
        data?: EntryTalent[];
    }>();
</script>

<template>
    <entry-section class="entry-talent" title="能力">
        <template v-if="data?.length">
            <template v-for="item in data">
                <hgroup>
                    <template v-if="item.type === `超能力`">
                        <h3 :id="item.name.zh">{{ item.name.zh }}</h3>
                        <nuxt-link
                            v-for="cls in item.class"
                            class="talent-tag tag"
                            :to="toEntry(`${cls}系`)"
                        >{{ cls }}</nuxt-link>
                        <nuxt-link
                            class="talent-tag tag"
                            :to="toEntry(`能力评级`)"
                        >Star {{ item.star }}</nuxt-link>
                        <span
                            v-if="item.name.en"
                            class="talent-tag tag"
                        >{{ item.name.en }}</span>
                    </template>
                    <template v-else>
                        <h3 :id="item.name">{{ item.name }}</h3>
                    </template>
                </hgroup>
                <novel-article as="div" :body="item.content"/>
            </template>
        </template>
    </entry-section>
</template>

<style lang="scss" scoped>
    .talent-tag {
        margin: 2px 0 0 6px;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 13px;
    }
</style>
