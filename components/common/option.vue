<script lang="ts" setup>
    import { injectionKey } from "~/types/select";

    const props = defineProps<{
        title: string;
        value?: any;
    }>();

    const {
        equal,
        set
    } = inject(injectionKey);

    //初始值更新
    equal(props.value) && update();

    function update() {
        set(props.value, props.title);
    }
</script>

<template>
    <li class="mb-option" :class="{ [`is-checked`]: equal(value) }" @click="update">
        <span>{{ title }}</span>
    </li>
</template>

<style lang="scss" scoped>
    .mb-option {
        padding-inline: 1em;
        border-radius: var(--circle-radius);
        line-height: 32px;
        cursor: pointer;

        &:hover {
            background-color: var(--color-info-light-8);
        }

        &.is-checked {
            color: var(--color-theme-text);
        }
    }
</style>