<script setup>
    defineProps(["when", "z"]);
</script>

<template>
    <Transition name="mask">
        <div v-if="when" class="mb-mask" :style="{ zIndex: z }"></div>
    </Transition>
</template>

<style lang="scss" scoped>
    .mb-mask {
        position: fixed;
        opacity: 0.5;
        inset: 0;
        background-color: black;
    }

    .mask-enter-active, .mask-leave-active {
        transition: opacity 0.4s;
    }

    .mask-enter-from, .mask-leave-to {
        opacity: 0;
    }
</style>