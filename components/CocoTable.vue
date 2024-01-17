<script setup>
    const props = defineProps({
        minWidth: {
            type: Number,
            default: 616
        }
    });
</script>

<template>
    <div class="coco-table-wrapper">
        <table class="coco-table" :style="{ minWidth: `${minWidth}px` }">
            <slot></slot>
        </table>
    </div>
</template>

<style lang="scss" scoped>
    .coco-table-wrapper {
        overflow: auto;
        border: 1px solid var(--color-border);
    }

    .coco-table {
        width: 100%;
        border-spacing: 2px;
    }
</style>