<script setup>
    import jArticle from "~/dist/json/Article.json";

    const jNovel = jArticle.bikari;
    const jVolume = jNovel.volume;
    const jChapter = jNovel.chapter;

    const jUpdated = jChapter
    .filter((c) => Reflect.has(c, "date"))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);
</script>

<template>
    <div class="content-widget home-update">
        <span class="content-h2 coco-title">更新历史</span>
        <ul class="update-list">
            <li v-for="item in jUpdated" class="update-item">
                <nuxt-link class="update-title" :to="`/book/bikari/${item.index}`">{{ item.title }}</nuxt-link>
                <div class="update-info">
                    <span class="text-ellipsis">{{ jVolume[item.volume].title }}</span>
                    <time>{{ item.date }}</time>
                </div>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
    .home-update {
        grid-area: A;
        width: 256px;
        padding: 16px 32px;
    }

    .update-item {
        margin-bottom: 4px;
        padding-bottom: 4px;
        border-bottom: 1px solid var(--color-border-light);
    }

    .update-title {
        line-height: 28px;
    }

    .update-info {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 8px;
        font-size: 12px;
        color: var(--color-gray);
    }

    @container main (width < 596px) {
        .home-update {
            width: 100%;
            padding-inline: 16px;
        }

        .update-list {
            display: grid;
            column-gap: 16px;
            grid-template-columns: 1fr 1fr;
        }
    }
</style>