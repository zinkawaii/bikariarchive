<script lang="ts" setup>
    import type { ContextMenuItem } from "~/types/context-menu";

    defineProps<{
        title?: string;
        items: ContextMenuItem[];
        root?: boolean;
    }>();
</script>

<template>
    <fieldset class="menu-group" :class="{ [`is-root`]: root }">
        <legend v-if="root" class="menu-title">{{ title }}</legend>
        <menu class="menu-list">
            <context-menu-item v-for="item in items" v-bind="item"/>
        </menu>
    </fieldset>
</template>

<style lang="scss" scoped>
    .menu-group {
        margin-top: 8px;
        cursor: auto;

        &:not(.is-root) {
            display: none;
            position: absolute;
            top: -18px;
            left: 100%;
            padding: 8px;
            border: 2px solid var(--color-theme-dark);
            border-left: none;
            border-radius: 16px;
            box-shadow: var(--box-shadow);
            background-color: var(--color-background-alpha);

            :hover > & {
                display: grid;
            }
        }

        &.is-root {
            padding-top: 8px;
            border-top: 1px solid var(--color-border-lighter);
        }
    }

    .menu-title {
        margin-left: 1em;
        padding-inline: 0.5em;
        font-family: var(--font-monospace);
        font-size: 12px;
        color: var(--color-info);
        user-select: none;
    }

    .menu-list {
        display: grid;
        gap: 4px;
        text-wrap: nowrap;
    }
</style>
