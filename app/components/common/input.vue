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
        border-radius: var(--bounded-full);
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