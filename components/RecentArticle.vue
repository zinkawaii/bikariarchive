<script setup>
    import jArticle from "~/dist/json/Article.json";

    const props = defineProps({
        type: String,
        limit: Number,
        sortBy: String
    });

    //是否按更新日期排序
    const sortByUpdated = computed(() => {
        return props.sortBy === "updated";
    });

    const jRecent = Object.entries(jArticle)
    .filter(([, { type }]) => type === props.type)
    .map(([novel, { chapter }]) => {
        return chapter.map((c) => ({
            ...c,
            novel
        }));
    })
    .flat(1)
    .filter((c) => Reflect.has(c, "date"))
    .sort((a, b) => {
        const x = sortByUpdated && a.updated || a.date;
        const y = sortByUpdated && b.updated || b.date;
        return y.localeCompare(x);
    })
    .slice(0, props.limit);
</script>

<template>
    <ul class="recent-article">
        <li v-for="{ index, title, date, updated, volume, novel } in jRecent" class="recent-item">
            <coco-link class="text-truncate recent-title" :to="{ name: `reader`, params: { novel, index } }">{{ title }}</coco-link>
            <div class="recent-info">
                <span class="text-truncate">{{ jArticle[novel].volume[volume].title }}</span>
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
        color: var(--color-gray);
    }
</style>