<script lang="ts" setup>
    defineProps<{
        title?: string;
    }>();
</script>

<template>
    <div class="content-widget coco-widget">
        <header v-if="title" class="widget-header">
            <h1 class="widget-title">{{ title }}</h1>
        </header>
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
    .coco-widget {
        padding: var(--cw-large);
    }

    .widget-header {
        margin-block: calc(-1 * var(--cw-large) + 2px) var(--cw-medium);
        padding-top: var(--cw-medium);
    }

    .widget-title {
        text-align: center;
    }
</style>