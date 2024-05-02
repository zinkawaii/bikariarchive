<script lang="ts" setup>
    const props = defineProps<{
        type: string;
        limit: number;
        sortBy?: string;
    }>();

    //是否按更新日期排序
    const sortByUpdated = computed(() => {
        return props.sortBy === "updated";
    });

    const jRecent = computed(() => {
        return Object.values(jArticle)
            .filter(({ type }) => type === props.type)
            .flatMap(({ chapters }) => chapters)
            .sort((a, b) => {
                const x = sortByUpdated.value && a.updated || a.date;
                const y = sortByUpdated.value && b.updated || b.date;
                return y.localeCompare(x);
            })
            .slice(0, props.limit);
    });
</script>

<template>
    <ul class="recent-article">
        <li v-for="{ title, date, updated, volume, novel, route } in jRecent" class="recent-item">
            <coco-link class="text-truncate recent-title" :to="route">{{ title }}</coco-link>
            <div class="recent-info">
                <span class="text-truncate">{{ jArticle[novel].volumes[volume].title }}</span>
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