<script lang="ts" setup>
    defineProps<{
        disabled?: boolean;
        full?: boolean;
        round?: boolean;
    }>();
</script>

<template>
    <button
        class="mb-button"
        :class="{
            [`is-disabled`]: disabled,
            [`is-full`]: full,
            [`is-round`]: round
        }"
        ><slot></slot>
    </button>
</template>

<style lang="scss">
    .mb-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.4em;
        padding-inline: 0.75em;
        border: 1px solid var(--color-theme-dark);
        border-radius: 4px;
        background-color: transparent;
        line-height: calc(2em - 2px);
        vertical-align: middle;
        text-wrap: nowrap;
        color: var(--color-theme-text);
        transition: all 0.4s;
        user-select: none;

        &:hover {
            background-color: var(--color-theme-dark);
            color: white;
        }

        &.is-disabled {
            border-color: var(--color-border);
            color: var(--color-text-disabled);
            pointer-events: none;
        }

        &.is-full {
            width: 100%;
        }

        &.is-round {
            border-radius: var(--bounded-full);
        }

        & + & {
            margin-inline-start: 0.5em;
        }
    }
</style>