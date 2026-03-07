<script lang="ts" setup>
    import { animate, type EasingParam } from "animejs";
    import type { TransitionProps } from "vue";

    const props = withDefaults(defineProps<{
        scale?: number;
        duration?: number;
        ease?: [EasingParam, EasingParam];
    }>(), {
        scale: 0.66,
        duration: 400,
        ease: () => ["outBack", "inBack"],
    });

    const onEnter: TransitionProps["onEnter"] = async (el, done) => {
        await animate(el, {
            opacity: [0, 1],
            scale: [props.scale, 1],
            duration: props.duration,
            ease: props.ease[0],
        });
        done();
    };

    const onLeave: TransitionProps["onLeave"] = async (el, done) => {
        await animate(el, {
            opacity: [1, 0],
            scale: [1, props.scale],
            duration: props.duration,
            ease: props.ease[1],
        });
        done();
    };
</script>

<template>
    <transition :css="false" @enter="onEnter" @leave="onLeave">
        <slot></slot>
    </transition>
</template>
