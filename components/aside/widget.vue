<script lang="ts" setup>
    defineProps<{
        title?: string;
        icon?: string;
    }>();
</script>

<template>
    <div class="content-widget aside-widget">
        <h2 v-if="title" class="content-h2 aside-title">
            <slot name="icon"></slot>
            <span>{{ title }}</span>
        </h2>
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
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
    }
</style>