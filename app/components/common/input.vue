<script lang="ts" setup>
    defineOptions({
        inheritAttrs: false
    });
    defineProps<{
        invalid?: boolean;
    }>();
    const modelValue = defineModel<string>();
</script>

<template>
    <div class="mb-input" :class="{ [`is-invalid`]: invalid }">
        <input
            class="input-entity"
            v-bind="$attrs"
            v-model="modelValue"
        />
    </div>
</template>

<style lang="scss" scoped>
    .mb-input {
        display: flex;
        height: 2rem;
        border: 1px solid var(--color-border-light);
        border-radius: 6px;
        outline: 2px solid transparent;
        outline-offset: -1px;
        background-color: var(--color-background);
        transition: outline 0.25s;

        &:focus-within {
            outline-color: var(--color-theme-dark);
        }

        &.is-invalid {
            outline-color: var(--color-danger);
        }
    }

    .input-entity {
        width: 100%;
        text-align: center;
    }
</style>