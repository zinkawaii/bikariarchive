<script lang="ts" setup>
    const toastStore = useToastStore();

    const toastList = computed(() => {
        return [...toastStore.map].toReversed();
    });
</script>

<template>
    <div class="toast-area">
        <transition-group name="toast">
            <toast-item
                v-for="[key, { icon, content }] in toastList"
                :key
                :name="key"
                :icon-info="icon"
                :content
            />
        </transition-group>
    </div>
</template>

<style lang="scss" scoped>
    .toast-area {
        display: grid;
        justify-items: center;
        position: fixed;
        top: 80px;
        pointer-events: none;
        inset-inline: 0;
    }

    .toast-enter-active, .toast-leave-active {
        transform-origin: top;
        transition: all 0.4s;
    }

    .toast-enter-from, .toast-leave-to {
        opacity: 0;
        margin-bottom: -38px;
        scale: 0;
    }
</style>