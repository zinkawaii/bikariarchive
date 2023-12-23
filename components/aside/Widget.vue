<script setup>
    const props = defineProps({
        title: String,
        icon: String
    });
</script>

<template>
    <div class="content-widget aside-widget">
        <h2 v-if="title" class="content-h2 aside-title">
            <i :class="[`fas`, `fa-${icon}`]"></i>
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
        margin-bottom: 4px;

        > span {
            padding-left: 6px;
        }
    }
</style>