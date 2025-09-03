<script lang="ts" setup>
    const modelValue = defineModel<boolean>({
        required: true,
    });
</script>

<template>
    <button class="setting-switch" @click="modelValue = !modelValue">
        <span class="switch-button" :class="{ [`is-checked`]: modelValue }">
            <span class="switch-thumb"></span>
        </span>
        <span class="switch-title">{{ modelValue ? "打开" : "关闭" }}</span>
    </button>
</template>

<style lang="scss" scoped>
    .setting-switch {
        display: flex;
        align-items: stretch;
        padding: 6px;
        border: 1px solid var(--color-border);
        border-radius: var(--rounded-full);
        line-height: 26px;
        user-select: none;
    }

    .switch-button {
        display: flex;
        width: 48px;
        padding: 3px;
        border: 1px solid var(--color-border);
        border-radius: var(--rounded-full);
        transition: all 0.25s;

        &.is-checked {
            border-color: var(--color-theme-dark);
            background-color: var(--color-theme-dark);
        }
    }

    .switch-thumb {
        aspect-ratio: 1;
        border-radius: var(--rounded-full);
        background-color: var(--color-gray-500);
        transition: all 0.25s;

        .is-checked > & {
            background-color: white;
            translate: 22px;
        }
    }

    .switch-title {
        flex: 1;
        text-align: center;
    }
</style>
