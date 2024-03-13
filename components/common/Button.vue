<script setup>
    defineProps({
        icon: String
    });
</script>

<template>
    <button class="mb-button">
        <fa v-if="icon?.length > 0" :icon="icon"/>
        <span v-if="$slots.default"><slot></slot></span>
    </button>
</template>

<style lang="scss" scoped>
    .mb-button {
        display: inline-block;
        padding-inline: 12px;
        border: 1px solid var(--color-theme-dark);
        border-radius: 4px;
        background-color: transparent;
        line-height: calc(2em - 2px);
        text-align: center;
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

        svg + span {
            margin-left: 0.4em;
        }
    }
</style>