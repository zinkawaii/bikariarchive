<script lang="ts" setup>
    import type { Article } from "~/utils/Article";

    const props = defineProps<{
        art: Article;
    }>();

    //当前选中卷
    const currentVolume = ref<number>();
    watchEffect(() => {
        currentVolume.value = props.art.volume;
    });

    //当前小说
    const jNovel = computed(() => {
        return props.art.novelInfo;
    });

    //本卷章节
    const jChapters = computed(() => {
        return jNovel.value.chapters.filter((c) => c.volume === currentVolume.value);
    });
</script>

<template>
    <aside-widget class="aside-unified">
        <form class="catalog-volume">
            <select class="content-h2 catalog-selector" v-model="currentVolume">
                <option v-for="({ title }, i) in jNovel.volumes" :value="i">{{ title }}</option>
            </select>
            <span class="catalog-underline"></span>
        </form>
        <ul class="aside-limited">
            <li v-for="c in jChapters" class="catalog-item">
                <nuxt-link class="text-truncate aside-anchor" :to="c.route">{{ c.title }}</nuxt-link>
            </li>
        </ul>
    </aside-widget>
</template>

<style lang="scss" scoped>
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

    .catalog-item {
        display: grid;

        & + & {
            margin-top: 4px;
        }
    }
</style>