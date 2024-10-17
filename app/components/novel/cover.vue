<script lang="ts" setup>
    import type { ArticleCover } from "@bikari/process";

    withDefaults(defineProps<{
        src?: string;
        align?: ArticleCover["align"];
    }>(), {
        align: "center"
    });
</script>

<template>
        <nuxt-img
            v-if="src"
            class="novel-image"
            :class="`is-${align}`"
            :src
            alt="[cover]"
            loading="lazy"
        />
    </figure>
</template>

<style lang="scss" scoped>
    .novel-cover {
        display: grid;
        position: relative;
        overflow: hidden;

        &::before {
            content: "Cover.";
            display: grid;
            place-items: center;
            position: absolute;
            opacity: 0.33;
            inset: 0;
            background-color: var(--color-info-light-5);
            font-size: 48px;
            font-weight: bold;
        }
    }

    .novel-image {
        position: absolute;
        height: 100%;
        object-fit: cover;

        &.is-top {
            object-position: top;
        }

        &.is-bottom {
            object-position: bottom;
        }
    }
</style>