<script lang="ts" generic="T" setup>
    defineProps<{
        value: T;
    }>();
    const modelValue = defineModel<T>({
        required: true,
    });
</script>

<template>
    <label class="mb-radio">
        <input class="radio-entity" type="radio" :value v-model="modelValue"/>
        <span class="radio-title"><slot></slot></span>
    </label>
</template>

<style lang="scss" scoped>
    .mb-radio {
        display: flex;
        align-items: center;
        gap: 0.25em;
    }

    .radio-entity {
        width: 1em;
        aspect-ratio: 1;
        padding: calc(0.5em - 1px);
        border: 1px solid var(--color-border);
        border-radius: var(--bounded-circle);
        background-clip: content-box;
        background-color: var(--color-theme-dark);
        transition: all 0.1s;
        appearance: none;
        cursor: pointer;

        &:checked {
            padding: 2px;

            + .radio-title {
                color: var(--color-theme-text);
            }
        }
    }
</style>
