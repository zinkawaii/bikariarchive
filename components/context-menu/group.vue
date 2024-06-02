<script lang="ts" setup>
    import type { UnwrapContextMenuItem } from "~/types/context-menu";

    defineProps<{
        when?: () => any;
        items: UnwrapContextMenuItem[];
        root?: boolean;
    }>();
</script>

<template>
    <menu
        v-if="when?.() ?? true"
        class="menu-group"
        :class="{
            [`is-root`]: root
        }"
        ><context-menu-item v-for="data in items" :data/>
    </menu>
</template>

<style lang="scss" scoped>
    .menu-group {
        display: grid;
        gap: 4px;
        margin-top: 8px;
        text-wrap: nowrap;
        cursor: auto;

        &.is-root {
            padding-top: 8px;
            border-top: 1px solid var(--color-border-lighter);
        }

        &:not(.is-root) {
            display: none;
            position: absolute;
            top: -18px;
            left: 100%;
            padding: 8px;
            border-block: 2px solid var(--color-theme-dark);
            border-radius: 16px;
            box-shadow: var(--box-shadow);
            background-color: var(--color-background-alpha);

            :hover > & {
                display: grid;
            }
        }
    }
</style>