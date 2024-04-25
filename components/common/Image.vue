<script lang="ts" setup>
    const imageViewerStore = useImageViewerStore();
    const $self = ref();

    function openViewer() {
        imageViewerStore.open($self.value.$el);
    }
</script>

<template>
    <nuxt-img ref="$self" class="cursor-pointer" @click="openViewer"/>
</template>