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
    <h2 :id class="story-heading" :data-modifier="modifier">
        <slot></slot>
    </h2>
</template>

<style lang="scss" scoped>
    .story-heading {
        --edge-fades-to: right;

        display: grid;
        justify-content: center;
        overflow-x: clip;
        margin-block: 16px;
        line-height: 1;
        text-align: center;
        animation-name: edge-fades;
        animation-timeline: view();

        &::before {
            content: attr(data-modifier);
            opacity: 0.5;
            margin-bottom: -32px;
            mask-image: linear-gradient(black 33%, transparent);
            font-size: 64px;
            text-wrap: nowrap;
            color: transparent;
            transition: color 0.25s;
            z-index: -1;
            -webkit-text-stroke: 1px var(--color-info);
        }
    }
</style>
