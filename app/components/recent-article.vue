<script lang="ts" setup>
    import type { NovelType } from "@bikari/article";

    const props = defineProps<{
        type?: NovelType;
        sizes: number;
        sortBy?: string;
    }>();

    //是否按更新日期排序
    const sortByUpdated = computed(() => {
        return props.sortBy === "updated";
    });

    const { articles } = useArticleList(props);
</script>

<template>
    <ul class="recent-article">
        <li v-for="{ title, volume, novel, route, publishDate, updateDate } in articles" class="recent-item">
            <plain-link class="recent-title text-truncate" :to="route">{{ title }}</plain-link>
            <div class="recent-info">
                <span class="text-truncate">{{ Article.meta[novel].volumes[volume].title }}</span>
                <time>{{ sortByUpdated ? updateDate : publishDate }}</time>
            </div>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
    .recent-article {
        display: grid;
        row-gap: 4px;
    }

    .recent-item {
        display: grid;
        padding-bottom: 4px;
        border-bottom: 1px dashed var(--color-border-light);
        font-size: 14px;
    }

    .recent-title {
        width: fit-content;
        max-width: 100%;
        line-height: 28px;
    }

    .recent-info {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 8px;
        font-size: 12px;
        color: var(--color-info);
    }
</style>