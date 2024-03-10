<script setup>
    const props = defineProps({
        chapter: Article
    });

    const catalogueStore = useCatalogueStore();
    const readRecordStore = useReadRecordStore();
    const { novel, infoType } = storeToRefs(catalogueStore);

    //最近阅读
    const isLastRead = computed(() => {
        return props.chapter.index === readRecordStore.get(novel.value).index;
    });
</script>

<template>
    <nuxt-link class="cacha-item" :to="chapter.route">
        <span class="font-italic text-gray">{{ chapter.orderInVol + 1 }}.</span>
        <span class="text-truncate cacha-title">{{ chapter.title }}</span>
        <ul class="cacha-tags">
            <li v-if="isLastRead" tag="last-read">最近阅读</li>
        </ul>
        <span class="text-gray">
            <template v-if="infoType === 0">{{ chapter.wordCount }} 字</template>
            <template v-else-if="infoType === 1">{{ chapter.publishDate }}</template>
        </span>
    </nuxt-link>
</template>

<style lang="scss" scoped>
    .cacha-item {
        display: grid;
        grid-template-columns: auto auto 1fr auto;
        gap: 8px;
        border-bottom: 1px dashed var(--color-border-light);
        font-size: 14px;
        line-height: 36px;

        &:hover {
            color: var(--color-theme-text);
        }
    }

    .cacha-title {
        font-size: 1rem;
    }

    .cacha-tags {
        display: flex;
        align-items: center;
        gap: 0.5em;
        line-height: 1.5em;
        text-wrap: nowrap;

        > li {
            padding-inline: 7px;
            border: 1px solid var(--color);
            border-radius: 4px;
            font-size: 13px;
            color: var(--color);

            &[tag="last-read"] {
                --color: var(--color-warning);
            }
        }
    }
</style>