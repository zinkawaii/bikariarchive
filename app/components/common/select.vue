<script lang="ts" generic="T" setup>
    import { injectionKey } from "~/types/select";

    const modelValue = defineModel<T>();

    const rootEl = useTemplateRef("root");
    const [isDrop, toggleDrop] = useToggle(false);

    const titleRef = ref<MaybeRefOrGetter<string>>();
    const title = computed(() => {
        return toValue(titleRef.value);
    });

    provide(injectionKey, {
        modelValue,
        bind(title) {
            titleRef.value = title;
            rootEl.value?.blur();
        }
    });
</script>

<template>
    <div
        ref="root"
        class="mb-select"
        tabindex="-1"
        @focus="toggleDrop(true)"
        @blur="toggleDrop(false)"
    >
        <span class="select-title">{{ title }}</span>
        <iconify class="select-arrow" :class="{ [`is-reverse`]: isDrop }" name="fa6-solid:chevron-down"/>
        <ul class="select-dropdown" :class="{ [`is-drop`]: isDrop }">
            <slot></slot>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
    .mb-select {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        position: relative;
        height: 2rem;
        padding-inline: 12px;
        border: 1px solid var(--color-border-light);
        border-radius: 6px;
        outline: 2px solid transparent;
        outline-offset: -1px;
        background-color: var(--color-background);
        font-size: 14px;
        transition: all 0.25s;
        cursor: pointer;

        &:focus {
            outline-color: var(--color-theme-dark);
        }
    }

    .select-title {
        transition: all 0.25s;

        :focus > & {
            color: var(--color-text-info);
        }
    }

    .select-arrow {
        color: var(--color-text-info);
        transition: rotate 0.25s;

        &.is-reverse {
            rotate: 180deg;
        }
    }

    .select-dropdown {
        position: absolute;
        top: 100%;
        width: 100%;
        margin-top: 8px;
        padding: 8px;
        border: 1px solid var(--color-border-light);
        border-radius: 6px;
        box-shadow: var(--box-shadow-dark);
        background-color: var(--color-background);
        transform-origin: top;
        transition: all 0.25s;

        &:not(.is-drop) {
            opacity: 0;
            scale: 1 0.66;
            pointer-events: none;
        }
    }
</style>