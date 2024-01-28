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
        currentVolume.value = art.value.volume;
    });

    //当前小说
    const jNovel = computed(() => {
        return jArticle[art.value.novel];
    });

    //本卷章节
    const jChapter = computed(() => {
        return jNovel.value.chapters.filter((c) => c.volume === currentVolume.value);
    });
</script>

<template>
    <aside-widget class="aside-catalog">
        <select class="content-h2 catalog-volume" v-model="currentVolume">
            <option v-for="({ title }, i) in jNovel.volumes" :value="i">{{ title }}</option>
        </select>
        <ul class="catalog-list">
            <li v-for="{ index, title } in jChapter">
                <nuxt-link class="text-truncate catalog-link" :to="{ params: { index } }">{{ title }}</nuxt-link>
            </li>
        </ul>
    </aside-widget>
</template>

<style lang="scss" scoped>
    .aside-catalog {
        display: flex;
        flex-direction: column;
        overflow: auto;
        max-height: calc(100vh - 96px);
        padding: 0;
    }

    .catalog-volume {
        margin: 8px 16px;
        padding-block: 8px;
        border-bottom: 1px solid var(--color-border);
        background-color: transparent;

        > option {
            font-family: initial;
            font-size: 1rem;
        }
    }

    .catalog-list {
        display: grid;
        gap: 4px;
        overflow: hidden scroll;
        overscroll-behavior: contain;
        padding: 0 8px 12px 12px;

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
        padding: 6px 0 6px 12px;
        border-radius: 8px;
        font-size: 14px;
        color: var(--color-text);

        &:hover {
            background-color: var(--color-info-light-5);
            color: white;
        }

        &.router-link-active {
            background-color: var(--color-theme);
            color: white;
        }
    }
</style>