<script setup>
    const imageViewerStore = useImageViewerStore();
    const $ = ref();

    function openViewer() {
        imageViewerStore.open($.value.$el);
    }
</script>

<template>
    <nuxt-img ref="$" class="mb-image" @click="openViewer"/>
</template>

<style lang="scss" scoped>
    .mb-image {
        cursor: pointer;
    }
</style>