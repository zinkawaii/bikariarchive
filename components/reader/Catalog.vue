<script setup>
    import jArticle from "~/dist/json/Article.json";

    const props = defineProps({
        art: Article
    });

    //当前选中卷
    const currentVolume = ref(props.art.volOrder);

    //当前小说
    const jNovel = computed(() => {
        return jArticle[props.art.novel];
    });

    //本卷章节
    const jChapter = computed(() => {
        return jNovel.value.chapter.filter((c) => c.volume === currentVolume.value);
    });
</script>

<template>
    <nav class="novel-catalog">
        <select class="catalog-volume" v-model="currentVolume">
            <option v-for="(v, i) in jNovel.volume" :value="i">{{ v.title }}</option>
        </select>
        <ul class="catalog-list">
            <li v-for="c in jChapter">
                <nuxt-link class="catalog-link" :to="{ params: { index: c.index } }">{{ c.title }}</nuxt-link>
            </li>
        </ul>
    </nav>
</template>

<style lang="scss" scoped>
    .novel-catalog {
        display: flex;
        flex: 1;
        flex-direction: column;
        overflow: auto;
        border: var(--border-theme-group);
        border-radius: 16px;
        box-shadow: var(--box-shadow);
        background-color: var(--color-background-alpha);
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
            background-color: var(--color-theme-block);
        }
    }

    .catalog-link {
        display: block;
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
            background-color: var(--color-theme-block);
            color: white;
        }
    }
</style>