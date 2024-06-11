<script lang="ts" setup>
    const dialogStore = useDialogStore();
    const { dialogs } = storeToRefs(dialogStore);
</script>

<template>
    <template v-for="{ component, zIndex, opening } in dialogs" :key="zIndex">
        <component :is="component" :opening :style="{ zIndex }"/>
    </template>
</template>