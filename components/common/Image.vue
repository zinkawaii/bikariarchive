<script setup>
    const props = defineProps({
        viewable: Boolean
    });

    const imageViewerStore = useImageViewerStore();
    const $ = ref();

    function openViewer() {
        props.viewable && imageViewerStore.open($.value.$el);
    }
</script>

<template>
    <nuxt-img ref="$" class="mb-image" :class="{ [`cursor-pointer`]: viewable }" @click="openViewer"/>
</template>