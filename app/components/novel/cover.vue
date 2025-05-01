<script lang="ts" setup>
    import type { ArticleCover } from "@bikari/article";

    withDefaults(defineProps<Partial<ArticleCover> & {
        viewable?: boolean;
    }>(), {
        align: "center",
    });
</script>

<template>
    <div class="novel-cover">
        <mb-image
            v-if="src"
            :src
            :align
            :reference
            :viewable
            alt="[cover]"
            loading="lazy"
        />
    </div>
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
            background-color: var(--color-gray-500);
            font-size: 48px;
            font-weight: bold;
        }
    }
</style>
