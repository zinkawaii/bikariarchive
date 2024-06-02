<script lang="ts" setup>
    import type { UnwrapContextMenuItem } from "~/types/context-menu";

    const { data } = defineProps<{
        data: UnwrapContextMenuItem;
    }>();

    const contextMenuStore = useContextMenuStore();

    function onClick() {
        if (data.action) {
            data.action();
            contextMenuStore.close();
        }
    }
</script>

<template>
    <li class="menu-item" @click="onClick">
        <icon :name="data.icon ?? (data.checked ? `fa6-solid:check` : ``)"/>
        <span>{{ data.title }}</span>
        <icon v-if="data.icon && data.checked" name="fa6-solid:check"/>
        <context-menu-group v-if="data.children" :items="data.children"/>
    </li>
</template>

<style lang="scss" scoped>
    .menu-item {
        display: grid;
        grid-template-columns: 16px 1fr 16px;
        align-items: center;
        gap: 6px;
        position: relative;
        height: 28px;
        padding-inline: 8px;
        border-radius: 8px;
        transition: all 0.25s;
        cursor: pointer;
        user-select: none;

        &:hover {
            background-color: var(--color-theme);
            color: white;
        }

        > .iconify {
            margin: auto;
        }
    }
</style>