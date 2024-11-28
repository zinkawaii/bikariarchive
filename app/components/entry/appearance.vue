<script lang="ts" setup>
    import type { EntryAppearance } from "@bikari/article";

    const props = defineProps<EntryAppearance>();

    const art = Article.for(() => props.novel, () => props.index);
</script>

<template>
    <p class="entry-appearance">
        首次登场于
        <plain-link @click="guideToShelf(art.novel, art.volume)">{{ art.volumeInfo.title }}</plain-link>
        -
        <plain-link :to="art.route">{{ art.title }}</plain-link>
    </p>
</template>

<style lang="scss" scoped>
    .entry-appearance {
        margin-top: auto;
        font-size: 12px;
        line-height: 21px;
        text-align: right;
        color: var(--color-info);
    }
</style>