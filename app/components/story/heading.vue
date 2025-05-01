<script lang="ts" setup>
    import { slug } from "github-slugger";

    const props = defineProps<{
        modifier?: string;
    }>();

    const id = computed(() => {
        return props.modifier ? slug(props.modifier) : void 0;
    });
</script>

<template>
    <h2 :id class="story-heading" :modifier>
        <span class="heading-title"><slot></slot></span>
    </h2>
</template>

<style lang="scss" scoped>
    .story-heading {
        --edge-fades-to: right;

        display: grid;
        justify-content: center;
        overflow-x: clip;
        margin-block: 16px 8px;
        text-align: center;
        animation-name: edge-fades;
        animation-timeline: view();

        &::before {
            content: attr(modifier);
            opacity: 0.5;
            mask: linear-gradient(black 33%, transparent);
            font-size: 64px;
            text-wrap: nowrap;
            color: transparent;
            transition: color 0.25s;
            -webkit-text-stroke: 1px var(--color-info);
        }
    }

    .heading-title {
        margin-top: -32px;
        isolation: isolate;
    }
</style>
