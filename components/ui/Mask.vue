<script setup>
    const maskStore = useMaskStore();

    const duration = computed(() => {
        return maskStore.duration / 1000 + "s";
    });
</script>

<template>
    <transition name="mask">
        <div v-if="maskStore.isOpened" class="z-mask" @click="maskStore.onclick()"></div>
    </transition>
</template>

<style lang="scss" scoped>
    .z-mask {
        position: fixed;
        opacity: 0.5;
        inset: 0;
        background-color: black;
    }

    .mask-enter-active, .mask-leave-active {
        transition: opacity v-bind("duration");
    }

    .mask-enter-from, .mask-leave-to {
        opacity: 0;
    }
</style>