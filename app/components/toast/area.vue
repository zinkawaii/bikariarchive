<script lang="ts" setup>
    const toastStore = useToastStore();

    const toastList = computed(() => {
        return [...toastStore.toasts].reverse();
    });
</script>

<template>
    <div class="toast-area">
        <transition-group tag="ul">
            <toast-item
                v-for="[name, { icon, message }] in toastList"
                :key="name"
                :name
                :icon-info="icon"
                :message
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
</style>
