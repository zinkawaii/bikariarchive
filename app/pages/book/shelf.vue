<script lang="ts" setup>
    const shelfStore = useShelfStore();
    const { novel, novelInfo, volumeInfo, articles } = storeToRefs(shelfStore);

    useHead({
        title: () => `${volumeInfo.value.title} - ${novelInfo.value.title}`,
    });
</script>

<template>
    <div class="shelf-section">
        <fieldset class="shelf-fieldset">
            <legend class="content-h2">{{ novelInfo.title }}</legend>
            <intro-content :novel/>
        </fieldset>
        <fieldset v-show="novelInfo.volumes.length" class="shelf-fieldset">
            <legend class="content-h2">卷册列表</legend>
            <shelf-volumes />
        </fieldset>
    </div>
    <fieldset v-show="articles.length" class="shelf-fieldset">
        <legend class="content-h2">章节列表</legend>
        <shelf-chapters />
    </fieldset>
</template>

<style lang="scss" scoped>
    .shelf-section {
        display: flex;
        column-gap: 32px;

        @include viewport("md") {
            flex-direction: column;
        }
    }

    .shelf-fieldset {
        flex: 1;
        margin-top: 16px;
        padding-top: 8px;
        border-top: 1px solid var(--color-border);

        > legend {
            margin: auto;
            padding-inline: 8px;
        }
    }
</style>
