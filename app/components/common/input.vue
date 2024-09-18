<script lang="ts" setup>
    defineProps<{
        readonly?: boolean;
    }>();
    const modelValue = defineModel<string>();
</script>

<template>
    <input
        class="mb-input"
        :readonly
        v-model="modelValue"
    />
</template>

<style lang="scss">
    .mb-input {
        width: 100%;
        height: 2rem;
        border: 1px solid var(--color-border-light);
        border-radius: 6px;
        outline: 2px solid transparent;
        outline-offset: -1px;
        text-align: center;
        transition: outline 0.25s;

        &:focus {
            outline-color: var(--color-theme-dark);
        }

        &.is-invalid {
            outline-color: var(--color-danger);
        }
    }
</style>