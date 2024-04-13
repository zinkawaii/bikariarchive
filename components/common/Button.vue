<script setup>

</script>

<template>
    <button class="mb-button">
        <slot></slot>
    </button>
</template>

<style lang="scss" scoped>
    .mb-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.4em;
        padding-inline: 12px;
        border: 1px solid var(--color-theme-dark);
        border-radius: 4px;
        background-color: transparent;
        line-height: calc(2em - 2px);
        color: var(--color-theme-text);
        transition: all 0.4s;
        cursor: pointer;
        user-select: none;

        &:hover {
            background-color: var(--color-theme-dark);
            color: white;
        }

        &[disabled] {
            border-color: var(--color-border);
            color: var(--color-text-disabled);
            pointer-events: none;
        }

        &[full] {
            width: 100%;
        }

        &[round] {
            border-radius: var(--circle-radius);
        }

        & + & {
            margin-inline-start: 0.5em;
        }
    }
</style>