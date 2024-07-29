<script lang="ts" setup>
    import type { EntryTalent } from "@bikari/process";

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
                        <h3>{{ item.name.zh }}</h3>
                        <nuxt-link
                            v-for="cls in item.class"
                            class="tag talent-tag"
                            :to="toEntry(`${cls}系`)"
                        >{{ cls }}</nuxt-link>
                        <nuxt-link
                            class="tag talent-tag"
                            :to="toEntry(`能力评级`)"
                        >Star {{ item.star }}</nuxt-link>
                        <span class="tag talent-tag">{{ item.name.en }}</span>
                    </template>
                    <template v-else>
                        <h3>{{ item.name }}</h3>
                    </template>
                </hgroup>
                <div class="novel-text" v-html="item.content"></div>
            </template>
        </template>
        <p v-else>未知。</p>
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