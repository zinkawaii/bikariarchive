<script lang="ts" setup>
    const props = withDefaults(defineProps<{
        scale?: number;
        duration?: number;
        ease?: string;
    }>(), {
        scale: 0.66,
        duration: 0.4,
        ease: "back"
    });

    const gsap = useGsap();

    async function onEnter(el, done) {
        await gsap.from(el, {
            opacity: 0,
            scale: props.scale,
            duration: props.duration,
            ease: `${props.ease}.out`
        });
        done();
    }

    async function onLeave(el, done) {
        await gsap.to(el, {
            opacity: 0,
            scale: props.scale,
            duration: props.duration,
            ease: `${props.ease}.in`
        });
        done();
    }
</script>

<template>
    <transition :css="false" @enter="onEnter" @leave="onLeave">
        <slot></slot>
    </transition>
</template>