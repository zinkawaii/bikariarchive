<script lang="ts" setup>
    const maskStore = useMaskStore();
</script>

<template>
    <transition-group name="mask">
        <div
            v-for="{ onClick }, i in maskStore.list"
            :key="i"
            class="z-mask"
            @click="onClick"
        ></div>
    </transition-group>
</template>

<style lang="scss" scoped>
    .z-mask {
        position: fixed;
        opacity: 0.5;
        inset: 0;
        background-color: black;
    }

    .mask-enter-active, .mask-leave-active {
        transition: opacity 0.4s;
    }

    .mask-enter-active {
        transition-timing-function: cubic-bezier(0, 0.43, 0.37, 1);
    }

    .mask-leave-active {
        transition-timing-function: cubic-bezier(0.43, 0, 1, 0.87);
    }

    .mask-enter-from, .mask-leave-to {
        opacity: 0;
    }
</style>