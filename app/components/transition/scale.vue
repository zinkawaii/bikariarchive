<script lang="ts" setup>
    import { animate, type Easing } from "motion-v";
    import type { BaseTransitionProps } from "vue";

    const props = withDefaults(defineProps<{
        scale?: number;
        duration?: number;
        ease?: [Easing, Easing];
    }>(), {
        scale: 0.66,
        duration: 0.4,
        ease: () => ["backOut", "backIn"]
    });

    const onEnter: BaseTransitionProps["onEnter"] = async (el, done) => {
        await animate(el, {
            opacity: [0, 1],
            scale: [props.scale, 1]
        }, {
            duration: props.duration,
            ease: props.ease[0]
        });
        done();
    };

    const onLeave: BaseTransitionProps["onLeave"] = async (el, done) => {
        await animate(el, {
            opacity: [1, 0],
            scale: [1, props.scale]
        }, {
            duration: props.duration,
            ease: props.ease[1]
        });
        done();
    };
</script>

<template>
    <transition :css="false" @enter="onEnter" @leave="onLeave">
        <slot></slot>
    </transition>
</template>