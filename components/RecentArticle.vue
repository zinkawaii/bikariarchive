<script setup>
    import jArticle from "~/dist/json/Article.json";

    const props = defineProps({
        type: String,
        limit: Number
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
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, props.limit);
</script>

<template>
    <ul class="recent-article">
        <li v-for="{ index, title, date, volume, novel } in jRecent" class="recent-item">
            <coco-link class="text-truncate recent-title" :to="{ name: `reader`, params: { novel, index } }">{{ title }}</coco-link>
            <div class="recent-info">
                <span class="text-truncate">{{ jArticle[novel].volume[volume].title }}</span>
                <time>{{ date }}</time>
            </div>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
    .recent-item {
        margin-bottom: 4px;
        padding-bottom: 4px;
        border-bottom: 1px dashed var(--color-border-light);
    }

    .recent-title {
        display: block;
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