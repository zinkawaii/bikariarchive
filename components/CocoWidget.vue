<script setup>
    const props = defineProps({
        title: String
    });
</script>

<template>
    <div class="content-widget coco-widget">
        <header v-if="title" class="cw-header">
            <h1 class="cw-title">{{ title }}</h1>
        </header>
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
    .coco-widget {
        padding: var(--cw-padding);
    }

    .cw-header {
        margin-block: calc(-1 * var(--cw-padding) + 2px) var(--cw-gap);
        padding-top: var(--cw-gap);
    }

    .cw-title {
        text-align: center;
    }
</style>