<script lang="ts" setup>
    defineProps<{
        title: string;
    }>();
</script>

<template>
    <li class="mb-option-group">
        <div class="group-title">{{ title }}</div>
        <ul><slot></slot></ul>
    </li>
</template>

<style lang="scss" scoped>
    .group-title {
        padding: 6px 14px;
        font-size: 12px;
        color: var(--color-text-info);
    }
</style>