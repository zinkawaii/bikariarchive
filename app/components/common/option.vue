<script lang="ts" generic="T" setup>
    import { injectionKey } from "~/types/select";

    const props = defineProps<{
        title: string;
        value?: T;
    }>();

    const {
        modelValue,
        bind
    } = inject(injectionKey);

    const isEqual = computed(() => {
        return modelValue.value === props.value;
    });

    whenever(isEqual, update, {
        immediate: true
    });

    function update() {
        modelValue.value = props.value;
        bind(() => props.title);
    }
</script>

<template>
    <li class="mb-option" :class="{ [`is-checked`]: isEqual }" @click="update">
        <span class="text-truncate">{{ title }}</span>
    </li>
</template>

<style lang="scss" scoped>
    .mb-option {
        height: 2em;
        padding-inline: 12px;
        border-radius: 8px;
        line-height: 2em;
        cursor: pointer;

        &:hover {
            background-color: var(--color-info-light-8);
        }

        &.is-checked {
            color: var(--color-theme-text);
        }
    }
</style>