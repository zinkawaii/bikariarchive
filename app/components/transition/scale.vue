<script lang="ts" setup>
    import { animate, type EasingParam } from "animejs";
    import type { BaseTransitionProps } from "vue";

    const props = withDefaults(defineProps<{
        scale?: number;
        duration?: number;
        ease?: [EasingParam, EasingParam];
    }>(), {
        scale: 0.66,
        duration: 400,
        ease: () => ["outBack", "inBack"]
    });

    const onEnter: BaseTransitionProps["onEnter"] = (el, done) => {
        animate(el, {
            opacity: [0, 1],
            scale: [props.scale, 1],
            duration: props.duration,
            ease: props.ease[0]
        }).then(done);
    };

    const onLeave: BaseTransitionProps["onLeave"] = (el, done) => {
        animate(el, {
            opacity: [1, 0],
            scale: [1, props.scale],
            duration: props.duration,
            ease: props.ease[1]
        }).then(done);
    };
</script>

<template>
    <transition :css="false" @enter="onEnter" @leave="onLeave">
        <slot></slot>
    </transition>
</template>