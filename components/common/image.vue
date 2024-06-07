<script lang="ts" setup>
    import { MbImageViewer } from "#components";

    const dialogStore = useDialogStore();
    const $self = ref();

    const { open, close } = dialogStore.use(() => h(MbImageViewer, {
        target: $self.value.$el,
        onClose: close
    }));
</script>

<template>
    <nuxt-img ref="$self" class="cursor-pointer" @click="open"/>
</template>