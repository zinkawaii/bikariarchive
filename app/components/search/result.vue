<script lang="ts" setup>
    import { injectionKey } from "~/types/search";
    import type { SearchResult } from "#server/api/search.get";

    const props = defineProps<SearchResult>();

    const { searchWord } = inject(injectionKey)!;

    const art = Article.for(() => props.novel, () => props.index);

    const partComp = useTemplateRef("part");
    useHighlight(partComp, searchWord, {
        name: "danger",
    });
</script>

<template>
    <nuxt-link class="search-result" :to="art.route">
        <h3 class="result-title">{{ art.title }}</h3>
        <span class="result-info">{{ art.volumeInfo.title }}</span>
        <novel-article ref="part" class="result-part" :body="parts"/>
        <span class="result-info result-right">本章共出现 {{ count }} 次</span>
    </nuxt-link>
</template>

<style lang="scss" scoped>
    .search-result {
        padding: 16px;
        border: 1px solid transparent;
        border-left-width: 16px;
        border-radius: 8px;
        transition: all 0.25s;

        &:hover {
            border-color: var(--color-border-lighter);
            border-left-color: var(--color-theme);
            background-color: var(--color-background);
        }
    }

    .result-title {
        line-height: 28px;
    }

    .result-info {
        font-size: 14px;
        color: var(--color-info);
    }

    .result-part {
        padding-block: 4px;
        font-size: 13px;

        :deep(p) {
            line-height: 22px;
        }
    }

    .result-right {
        float: right;
    }
</style>
