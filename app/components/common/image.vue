<script lang="ts" setup>
    import { MbImageViewer } from "#components";

    const rootEl = useCurrentElement<HTMLImageElement>();
    const dialogStore = useDialogStore();

    const { open, close } = dialogStore.use(() => h(MbImageViewer, {
        target: rootEl.value,
        onClose: close
    }));
</script>

<template>
    <nuxt-img class="cursor-pointer" @click="open"/>
</template>