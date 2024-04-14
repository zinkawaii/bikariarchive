<script setup>
    const toastStore = useToastStore();

    const toastList = computed(() => {
        const res = [];
        for (const item of toastStore.map) {
            res.unshift(item);
        }
        return res;
    });
</script>

<template>
    <div class="toast-area">
        <transition-group name="toast">
            <toast-item
                v-for="[key, { icon, content }] in toastList"
                :key="key"
                :name="key"
                :icon-info="icon"
                :content="content"
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