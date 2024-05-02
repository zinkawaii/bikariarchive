<script lang="ts" setup>
    const params = useRouteParams<{
        novel: string;
        index: string;
    }>();

    //当前章节
    const art = computed(() => {
        const { novel, index } = params.value;
        return Article.for(novel, index);
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
    const jChapters = computed(() => {
        return jNovel.value.chapters.filter((c) => c.volume === currentVolume.value);
    });
</script>

<template>
    <aside-widget class="aside-catalog">
        <form class="catalog-volume">
            <select class="content-h2 catalog-selector" v-model="currentVolume">
                <option v-for="({ title }, i) in jNovel.volumes" :value="i">{{ title }}</option>
            </select>
            <span class="catalog-underline"></span>
        </form>
        <ul class="catalog-list">
            <li v-for="c in jChapters">
                <nuxt-link class="text-truncate catalog-link" :to="c.route">{{ c.title }}</nuxt-link>
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
        display: grid;
        margin: 8px 16px;
    }

    .catalog-selector {
        padding-block: 8px;
        border-bottom: 1px solid var(--color-border);
        background-color: transparent;

        &:focus + .catalog-underline {
            scale: 1;
        }

        > option {
            font-family: var(--font);
            font-size: 1rem;
        }
    }

    .catalog-underline {
        height: 1px;
        margin-top: -1px;
        background-color: var(--color-theme-dark);
        transform-origin: left;
        transition: all 0.4s;
        scale: 0 1;
    }

    .catalog-list {
        overflow: hidden scroll;
        overscroll-behavior: contain;
        padding: 0 7px 8px 12px;

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
        margin-bottom: 4px;
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