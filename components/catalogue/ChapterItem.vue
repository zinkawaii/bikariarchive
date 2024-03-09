<script setup>
    const props = defineProps({
        i: Number
    });

    const catalogueStore = useCatalogueStore();
    const readRecordStore = useReadRecordStore();
    const { novel, infoType, jChapters } = storeToRefs(catalogueStore);

    const chapter = computed(() => {
        return jChapters.value[props.i];
    });

    //最近阅读
    const isLastRead = computed(() => {
        return chapter.value.index === readRecordStore.get(novel.value).index;
    });
</script>

<template>
    <nuxt-link class="cacha-item" :to="{ name: `reader`, params: { novel, index: chapter.index }}">
        <span class="font-italic text-gray">{{ i + 1 }}.</span>
        <span class="text-truncate cacha-title">{{ chapter.title }}</span>
        <ul class="cacha-tags">
            <li v-if="isLastRead" tag="last-read">最近阅读</li>
        </ul>
        <span class="text-gray">
            <template v-if="infoType === 0">{{ chapter.wordCount }} 字</template>
            <template v-else-if="infoType === 1">{{ chapter.date ?? chapter.refactored ?? "很久以前" }}</template>
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
            padding-inline: 6px;
            border: 1px solid var(--color);
            border-radius: 6px;
            font-size: 13px;
            color: var(--color);

            &[tag="last-read"] {
                --color: var(--color-warning);
            }
        }
    }
</style>