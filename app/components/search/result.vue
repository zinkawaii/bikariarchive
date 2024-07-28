<script lang="ts" setup>
    import { injectionKey } from "~/types/search";
    import type { SearchResult } from "~~/server/types/api/search";

    const props = defineProps<SearchResult>();

    const { searchWord } = inject(injectionKey);

    const art = computed(() => {
        return Article.for(props.novel, props.index);
    });

    const part = computed(() => {
        return props.parts.join("");
    });

    const $part = ref();
    useHighlight($part, searchWord, {
        name: "danger"
    });
</script>

<template>
    <nuxt-link class="search-result" :to="art.route">
        <h3 class="result-title">{{ art.title }}</h3>
        <span class="result-info">{{ art.volumeInfo.title }}</span>
        <article ref="$part" class="novel-text result-part" v-html="part"></article>
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
        color: var(--color-text-info);
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