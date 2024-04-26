<script setup>
    const props = defineProps({
        danger: {
            type: Boolean,
            default: false
        }
    });
</script>

<template>
    <nuxt-link class="coco-link" :class="{ danger }"><slot></slot></nuxt-link>
</template>

<style lang="scss">
    .coco-link {
        color: var(--color-link);

        &.danger {
            color: var(--color-danger);
        }
    }
</style>