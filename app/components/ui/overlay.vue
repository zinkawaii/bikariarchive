<script lang="ts" setup>
    const dialogStore = useDialogStore();

    const filterDialogs = computed(() => {
        return dialogStore.dialogs.filter((ctx) => ctx.isOpening);
    });
</script>

<template>
    <transition-group>
        <div
            v-for="{ zIndex, close } in filterDialogs"
            :key="zIndex"
            class="mb-overlay"
            :style="{ zIndex: zIndex - 1 }"
            @click="close()"
        ></div>
    </transition-group>
</template>

<style lang="scss" scoped>
    .mb-overlay {
        position: fixed;
        opacity: 0.5;
        inset: 0;
        background-color: black;

        &:where(.v-enter-active, .v-leave-active) {
            transition: opacity 0.4s;
            transition-timing-function: cubic-bezier(var(--bezier));
        }

        &.v-enter-active {
            --bezier: 0, 0.43, 0.37, 1;
        }

        &.v-leave-active {
            --bezier: 0.43, 0, 1, 0.87;
        }

        &:where(.v-enter-from, .v-leave-to) {
            opacity: 0;
        }
    }
</style>