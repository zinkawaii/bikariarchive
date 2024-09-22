<script lang="ts" setup>
    const toastStore = useToastStore();

    const toastList = computed(() => {
        return [...toastStore.map].toReversed();
    });
</script>

<template>
    <div class="toast-area">
        <transition-group>
            <toast-item
                v-for="[key, { icon, message }] in toastList"
                :key
                :name="key"
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