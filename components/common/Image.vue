<script lang="ts" setup>
    const imageViewerStore = useImageViewerStore();
    const $ = ref();

    function openViewer() {
        imageViewerStore.open($.value.$el);
    }
</script>

<template>
    <nuxt-img ref="$" class="cursor-pointer" @click="openViewer"/>
</template>