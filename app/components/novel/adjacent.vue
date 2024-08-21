<script lang="ts" setup>
    import type { Article } from "~/utils/Article";

    defineProps<{
        art: Article;
        type: "prev" | "next";
    }>();
</script>

<template>
    <nuxt-link
        class="novel-adjacent"
        :class="`is-${type}`"
        :to="art?.route"
        ><h3 class="adjacent-sign">
            <icon name="solar:rewind-forward-bold-duotone"/>
            <span>{{ art?.title }}</span>
        </h3>
        <p class="text-small text-gray">{{ art?.volumeInfo.title }}</p>
    </nuxt-link>
</template>

<style lang="scss" scoped>
    .novel-adjacent {
        display: grid;
        align-items: center;

        &.is-prev .iconify {
            scale: -1;
        }

        &.is-next {
            margin-left: auto;
            direction: rtl;
        }
    }

    .adjacent-sign {
        margin-bottom: 2px;
        line-height: 1.5em;
        color: var(--color-theme-text);

        > .iconify {
            margin-inline-end: 8px;
            vertical-align: -3px;
        }
    }
</style>