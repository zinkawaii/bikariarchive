<script setup>
    defineProps(["when", "z", "duration"]);
</script>

<template>
    <transition name="mask">
        <div v-if="when" class="mb-mask" :style="{ zIndex: z }"></div>
    </transition>
</template>

<style lang="scss" scoped>
    .mb-mask {
        position: fixed;
        opacity: 0.5;
        inset: 0;
        background-color: black;
    }

    .mask-enter-active, .mask-leave-active {
        transition: opacity v-bind("(duration ?? 400) / 1000 + `s`");
    }

    .mask-enter-from, .mask-leave-to {
        opacity: 0;
    }
</style>