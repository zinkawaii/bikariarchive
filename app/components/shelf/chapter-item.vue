<script lang="ts" setup>
    import type { Article } from "~/utils/article";

    const props = defineProps<{
        chapter: Article;
    }>();

    const shelfStore = useShelfStore();
    const readRecordStore = useReadRecordStore();
    const { novel, infoType } = storeToRefs(shelfStore);

    const tags = [
        {
            name: "草稿",
            color: "rgb(216 108 234)",
            when: () => props.chapter.draft
        },
        {
            name: "最近阅读",
            color: "var(--color-warning)",
            when: () => props.chapter.index === readRecordStore.get(novel.value)?.index
        }
    ];
</script>

<template>
    <nuxt-link class="shech-item" :to="chapter.route">
        <span class="font-italic text-gray">{{ chapter.orderInVol + 1 }}.</span>
        <span class="text-truncate shech-title">{{ chapter.title }}</span>
        <ul class="shech-tags">
            <template v-for="{ name, color, when } in tags">
                <li
                    v-if="toValue(when)"
                    class="shech-tag"
                    :style="`--color: ${color}`"
                >{{ name }}</li>
            </template>
        </ul>
        <span class="text-gray">{{
            infoType === 0 ? `${chapter.wordCount} 字` :
            infoType === 1 ? chapter.publishDate : ""
        }}</span>
    </nuxt-link>
</template>

<style lang="scss" scoped>
    .shech-item {
        display: grid;
        grid-template-columns: auto auto 1fr auto;
        gap: 8px;
        border-bottom: 1px dashed var(--color-border-light);
        font-size: 14px;
        line-height: 36px;

        &:hover {
            color: var(--color-theme-text);
        }
    }

    .shech-title {
        font-size: 1rem;
    }

    .shech-tags {
        display: flex;
        align-items: center;
        gap: 0.5em;
        line-height: 1.5em;
        text-wrap: nowrap;
    }

    .shech-tag {
        padding-inline: 7px;
        border: 1px solid var(--color);
        border-radius: 4px;
        font-size: 13px;
        color: var(--color);
    }
</style>