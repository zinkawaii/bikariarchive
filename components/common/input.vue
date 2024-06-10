<script lang="ts" setup>
    defineProps<{
        readonly?: boolean;
    }>();
    const modelValue = defineModel<string>();
</script>

<template>
    <input
        class="mb-input"
        :value="modelValue"
        :readonly
    />
</template>

<style lang="scss">
    .mb-input {
        width: 100%;
        border: 1px solid var(--color-border-light);
        border-radius: 4px;
        line-height: calc(2em - 2px);
        text-align: center;
        transition: border 0.25s;

        &:focus {
            border-color: var(--color-theme-dark);
        }

        &.is-invalid {
            border-color: var(--color-danger);
        }
    }
</style>