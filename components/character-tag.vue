<script lang="ts" setup>
    defineProps<{
        name: string;
    }>();
</script>

<template>
    <nuxt-link class="character-tag" :to="toEntry(name)">
        <nuxt-img class="tag-icon" :src="`/garden/icon/${name}.png`" :alt="name" placeholder="/garden/icon/unknown.png"/>
        <span class="tag-name">{{ name }}</span>
    </nuxt-link>
</template>

<style lang="scss" scoped>
    .character-tag {
        display: inline-flex;
        align-items: center;
        padding-right: 8px;
        border: 1px solid var(--color-theme-dark);
        border-radius: var(--circle-radius);
        background-color: var(--color-background);
        font-family: var(--font);
        font-size: 14px;
        vertical-align: middle;
        color: var(--color-theme-text);
    }

    .tag-icon {
        width: 2em;
        height: 2em;
        margin: 2px;
        border-radius: 100%;
    }

    .tag-name {
        padding-inline: 5px;
        text-wrap: nowrap;
    }
</style>