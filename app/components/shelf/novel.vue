<script lang="ts" setup>
    const shelfStore = useShelfStore();
    const { currentNovelIdx } = storeToRefs(shelfStore);
</script>

<template>
    <div class="shelf-novel">
        <ul class="sheno-list" :style="{ translate: `${currentNovelIdx * -144}px` }">
            <shelf-novel-item
                v-for="(jNovel, key) in Article.meta"
                :key
                :novel="key"
                v-bind="jNovel"
            />
        </ul>
    </div>
</template>

<style lang="scss" scoped>
    .shelf-novel {
        overflow: hidden;
        padding-left: calc(50% - 72px);
        animation-name: edge-fades;
        animation-timeline: view();
    }

    .sheno-list {
        display: flex;
        width: fit-content;
        transition: all 0.4s;
    }
</style>