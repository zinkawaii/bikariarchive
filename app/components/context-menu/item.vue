<script lang="ts" setup>
    import type { ContextMenuItem } from "~/types/context-menu";

    const props = defineProps<{
        data: ContextMenuItem;
    }>();

    const icon = computed(() => toValue(props.data.icon));
    const checked = computed(() => toValue(props.data.checked));
    const disabled = computed(() => toValue(props.data.disabled));
</script>

<template>
    <li class="menu-item" :class="{ [`is-disabled`]: disabled }" @click="data.action">
        <iconify :name="icon ?? (checked ? `fa6-solid:check` : ``)"/>
        <span>{{ data.title }}</span>
        <iconify v-if="icon && checked" name="fa6-solid:check"/>
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
        color: var(--color-text-primary);
        transition: all 0.25s;
        cursor: pointer;
        user-select: none;

        &:hover {
            background-color: var(--color-theme);
            color: white;
        }

        &.is-disabled {
            color: var(--color-text-disabled);
            pointer-events: none;
        }

        > .iconify {
            margin: auto;
        }
    }
</style>
