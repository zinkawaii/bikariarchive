<script lang="ts" setup>
    import type { NovelType } from "@bikari/process";

    const props = defineProps<{
        type?: NovelType;
        limit: number;
        sortBy?: string;
    }>();

    //是否按更新日期排序
    const sortByUpdated = computed(() => {
        return props.sortBy === "updated";
    });

    const { jLimited } = useArticleList(props);
</script>

<template>
    <ul class="recent-article">
        <li v-for="{ title, date, updated, volume, novel, route } in jLimited" class="recent-item">
            <plain-link class="text-truncate recent-title" :to="route">{{ title }}</plain-link>
            <div class="recent-info">
                <span class="text-truncate">{{ Article.meta[novel].volumes[volume].title }}</span>
                <time>{{ sortByUpdated && updated || date }}</time>
            </div>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
    .recent-item {
        display: grid;
        margin-bottom: 4px;
        padding-bottom: 4px;
        border-bottom: 1px dashed var(--color-border-light);
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
        color: var(--color-text-info);
    }
</style>