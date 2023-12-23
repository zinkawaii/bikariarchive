<script setup>
    import jArticle from "~/dist/json/Article.json";

    const route = useRoute();

    //当前章节
    const art = computed(() => {
        const { novel, index } = route.params;
        return new Article(novel, index);
    });

    //当前选中卷
    const currentVolume = ref();
    watchEffect(() => {
        currentVolume.value = art.value.volOrder;
    });

    //当前小说
    const jNovel = computed(() => {
        return jArticle[art.value.novel];
    });

    //本卷章节
    const jChapter = computed(() => {
        return jNovel.value.chapter.filter((c) => c.volume === currentVolume.value);
    });
</script>

<template>
    <nav class="content-widget aside-catalog">
        <select class="catalog-volume" v-model="currentVolume">
            <option v-for="({ title }, i) in jNovel.volume" :value="i">{{ title }}</option>
        </select>
        <ul class="catalog-list">
            <li v-for="{ index, title } in jChapter">
                <nuxt-link class="catalog-link" :to="{ params: { index } }">{{ title }}</nuxt-link>
            </li>
        </ul>
    </nav>
</template>

<style lang="scss" scoped>
    .aside-catalog {
        --p: 96px;

        display: flex;
        flex-direction: column;
        overflow: auto;
        height: calc(100vh - var(--p));
        margin-top: 16px;
        border-block: none;
    }

    .catalog-volume {
        margin: 4px 16px 8px;
        padding-block: 8px;
        border-bottom: 1px solid var(--color-border);
        background-color: transparent;
        font-weight: bold;

        > option {
            font-weight: normal;
        }
    }

    .catalog-list {
        display: grid;
        gap: 4px;
        overflow: hidden scroll;
        overscroll-behavior: contain;
        padding: 0 8px 8px;

        &::-webkit-scrollbar {
            width: 5px;
        }

        &::-webkit-scrollbar-thumb {
            border: 0;
            background-color: var(--color-theme);
        }

        > li {
            display: grid;
        }
    }

    .catalog-link {
        overflow: hidden;
        padding: 6px 0 6px 16px;
        border-radius: 8px;
        font-size: 14px;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: var(--color-text);

        &:hover {
            background-color: var(--color-border);
            color: white;
        }

        &.router-link-active {
            background-color: var(--color-theme);
            color: white;
        }
    }
</style>