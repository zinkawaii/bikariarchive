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
        padding: var(--cw-large);
    }

    .cw-header {
        margin-block: calc(-1 * var(--cw-large) + 2px) var(--cw-medium);
        padding-top: var(--cw-medium);
    }

    .cw-title {
        text-align: center;
    }
</style>