<script setup>
    useHead({
        title: "目录"
    });

    const catalogueStore = useCatalogueStore();
    const { novel, jNovel, jChapters } = storeToRefs(catalogueStore);
</script>

<template>
    <coco-widget title="目录">
        <catalogue-shelf />
        <div class="catalogue-section">
            <fieldset class="catalogue-fieldset">
                <legend class="content-h2">{{ jNovel.title }}</legend>
                <intro-content :novel="novel"/>
            </fieldset>
            <fieldset v-show="jNovel.volumes.length" class="catalogue-fieldset">
                <legend class="content-h2">卷册列表</legend>
                <catalogue-volume />
            </fieldset>
        </div>
        <fieldset v-show="jChapters.length" class="catalogue-fieldset">
            <legend class="content-h2">章节列表</legend>
            <catalogue-chapter />
        </fieldset>
    </coco-widget>
</template>

<style lang="scss" scoped>
    .catalogue-section {
        display: flex;
        column-gap: 32px;
    }

    .catalogue-fieldset {
        flex: 1;
        margin-top: 16px;
        padding-top: 8px;
        border-top: 1px solid var(--color-border);

        > legend {
            margin: auto;
            padding-inline: 8px;
        }
    }

    @container main (width < 768px) {
        .catalogue-section {
            flex-direction: column;
        }
    }
</style>