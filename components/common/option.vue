<script lang="ts" setup>
    import { injectionKey } from "~/types/select";

    const props = defineProps<{
        title: string;
        value?: any;
    }>();

    const {
        modelValue,
        bind
    } = inject(injectionKey);

    const isEqual = computed(() => {
        return modelValue.value === props.value;
    });

    //初始值更新
    whenever(isEqual, () => {
        bind(() => props.title);
    }, {
        immediate: true
    });

    function update() {
        modelValue.value = props.value;
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
        padding-inline: 1em;
        border-radius: var(--circle-radius);
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