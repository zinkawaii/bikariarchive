<script lang="ts" setup>
    const dialogStore = useDialogStore();
    const { dialogs } = storeToRefs(dialogStore);
</script>

<template>
    <template v-for="{ component, zIndex, isOpening } in dialogs" :key="zIndex">
        <component :is="component" :is-opening :style="{ zIndex }"/>
    </template>
</template>