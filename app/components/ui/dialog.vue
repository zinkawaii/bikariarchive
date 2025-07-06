<script lang="ts" setup>
    const dialogStore = useDialogStore();
    const { dialogs } = storeToRefs(dialogStore);
</script>

<template>
    <template v-for="{ vnode, zIndex, isOpening } in dialogs" :key="zIndex">
        <component :is="vnode" :is-opening="isOpening.value" :style="{ zIndex }"/>
    </template>
</template>
