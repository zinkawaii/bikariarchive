<script lang="ts" setup>
    defineProps<{
        items: string[];
    }>();

    const selectedIndex = ref(0);
</script>

<template>
    <div class="mb-tab">
        <ul class="tab-list">
            <li
                v-for="(name, i) in items"
                class="tab-item"
                :class="{ [`is-active`]: selectedIndex === i }"
                @click="selectedIndex = i"
            >{{ name }}</li>
        </ul>
        <ul class="tab-content">
            <li v-for="(name, i) in items" v-show="selectedIndex === i">
                <slot :name></slot>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
    .tab-list {
        display: flex;
        align-items: flex-end;
        height: 32px;
    }

    .tab-item {
        overflow: hidden;
        height: 18px;
        margin-bottom: 5px;
        padding: 0 12px 5px;
        font-size: 14px;
        line-height: 1.5;
        word-break: break-all;

        &:first-child {
            border-left: 1px solid transparent;
        }

        &:last-child {
            border-right: 1px solid transparent;
        }

        &.is-active {
            height: 32px;
            margin: 0 0 -1px;
            padding: 3px 12px 6px;
            border: 1px solid var(--color-border-lighter);
            border-top: 4px solid var(--color-theme);
            border-bottom: 0;
            background-color: var(--color-background);
            z-index: 1;
        }

        &:not(.is-active) {
            color: var(--color-info);
            cursor: pointer;

            & + & {
                border-left: 1px solid var(--color-border-lighter);
            }
        }
    }

    .tab-content {
        min-height: 64px;
        padding: 8px;
        border: 1px solid var(--color-border-lighter);
        background-color: var(--color-background);
    }
</style>