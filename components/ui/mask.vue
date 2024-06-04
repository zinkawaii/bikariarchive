<script lang="ts" setup>
    const dialogStore = useDialogStore();
</script>

<template>
    <transition-group name="mask">
        <div
            v-for="{ zIndex, onClose }, i in dialogStore.dialogs"
            :key="i"
            class="mb-mask"
            :style="{ zIndex: zIndex - 1 }"
            @click="onClose"
        ></div>
    </transition-group>
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