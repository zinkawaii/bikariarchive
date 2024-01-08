<script setup>
    const props = defineProps({
        name: String
    });
</script>

<template>
    <nuxt-link class="character-tag" :to="toEntry(name)">
        <nuxt-img :src="`/garden/icon/${name}.png`" placeholder="/garden/icon/unknown.png"/>
        <span>{{ name }}</span>
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
        font-size: 14px;
        vertical-align: middle;
        color: var(--color-theme-text);

        img {
            width: 2em;
            height: 2em;
            margin: 2px;
            border-radius: 100%;
        }

        span {
            padding-inline: 5px;
            text-wrap: nowrap;
        }
    }
</style>