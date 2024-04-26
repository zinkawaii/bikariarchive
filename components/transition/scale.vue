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

    const fromState = computed(() => ({
        opacity: 0,
        scale: props.scale
    }));

    const toState = computed(() => ({
        opacity: 1,
        scale: 1
    }));

    async function onEnter(el, done) {
        await gsap.fromTo(el, fromState.value, {
            ...toState.value,
            duration: props.duration,
            ease: `${props.ease}.out`
        });
        done();
    }

    async function onLeave(el, done) {
        await gsap.fromTo(el, toState.value, {
            ...fromState.value,
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