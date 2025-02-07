<script lang="ts" setup>
    defineProps<{
        title?: string;
    }>();
</script>

<template>
    <section class="aside-widget content-widget">
        <h2 v-if="title" class="aside-title content-h2">
            <slot name="icon"></slot>
            <span>{{ title }}</span>
        </h2>
        <slot></slot>
    </section>
</template>

<style lang="scss">
    .aside-widget {
        margin-top: 16px;
        padding: 16px;
        border-block: none;
    }

    .aside-title {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 4px;

        > .iconify {
            width: 1em;
        }
    }
</style>