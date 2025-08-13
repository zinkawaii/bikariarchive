<script lang="ts" setup>
    import type { ToastIconInfo } from "~/types/toast";

    const props = defineProps<{
        name: string;
        iconInfo: ToastIconInfo;
        message: string;
    }>();

    const toastStore = useToastStore();

    onMounted(async () => {
        await Zin.delay(5000);
        remove();
    });

    function remove() {
        toastStore.remove(props.name);
    }
</script>

<template>
    <li class="toast-item" @click="remove">
        <p class="toast-content">
            <iconify :name="iconInfo.name" size="20" :style="{ color: iconInfo.color }"/>
            <span>{{ message }}</span>
        </p>
        <div class="toast-progress"></div>
    </li>
</template>

<style lang="scss" scoped>
    .toast-item {
        overflow: hidden;
        margin-bottom: 16px;
        padding-top: 2px;
        border: 1px solid var(--color-border-light);
        border-radius: var(--rounded-full);
        box-shadow: var(--box-shadow-dark);
        background-color: var(--color-background);
        cursor: pointer;
        pointer-events: auto;

        &:where(.v-enter-active, .v-leave-active) {
            transform-origin: top;
            transition: all 0.4s;
        }

        &:where(.v-enter-from, .v-leave-to) {
            opacity: 0;
            margin-bottom: -38px;
            scale: 0;
        }
    }

    .toast-content {
        display: flex;
        align-items: center;
        gap: 8px;
        padding-inline: 14px 18px;
        font-size: 14px;
        line-height: 32px;
    }

    .toast-progress {
        height: 2px;
        background-color: var(--color-theme);
        transform-origin: left;
        animation: progress linear 5s;
    }

    @keyframes progress {
        from {
            scale: 0 1;
        }

        to {
            scale: 1;
        }
    }
</style>
