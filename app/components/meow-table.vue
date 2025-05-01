<script lang="ts" setup>
    withDefaults(defineProps<{
        minWidth?: number;
    }>(), {
        minWidth: 616,
    });
</script>

<template>
    <div class="meow-table-wrapper">
        <table class="meow-table" :style="{ minWidth: `${minWidth}px` }">
            <slot></slot>
        </table>
    </div>
</template>

<style lang="scss" scoped>
    .meow-table-wrapper {
        overflow: auto;
        border: 1px solid var(--color-border);
    }

    .meow-table {
        border-spacing: 2px;
    }
</style>
