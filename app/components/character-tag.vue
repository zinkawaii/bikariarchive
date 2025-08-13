<script lang="ts" setup>
    defineProps<{
        name: string;
    }>();
</script>

<template>
    <nuxt-link class="character-tag" :to="toEntry(name)">
        <nuxt-img class="tag-avatar" :src="`/garden/icon/${name}.png`" alt="[avatar]" placeholder="/garden/icon/unknown.png"/>
        <span class="tag-name">{{ name }}</span>
    </nuxt-link>
</template>

<style lang="scss" scoped>
    .character-tag {
        display: inline-flex;
        align-items: center;
        padding-right: 8px;
        border: 1px solid var(--color-theme-dark);
        border-radius: var(--rounded-full);
        background-color: var(--color-background);
        font-family: var(--font-primary);
        font-size: 14px;
        vertical-align: middle;
        color: var(--color-theme-text);
    }

    .tag-avatar {
        width: 28px;
        aspect-ratio: 1;
        margin: 2px;
        border-radius: var(--rounded-circle);
    }

    .tag-name {
        padding-inline: 5px;
        text-wrap: nowrap;
    }
</style>
