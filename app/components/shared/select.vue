<script lang="ts" generic="T" setup>
    interface Option {
        label: string;
        group?: boolean;
        value?: T;
    }

    const props = defineProps<{
        options: Option[];
    }>();

    const modelValue = defineModel<T>({
        required: true,
    });

    const rootEl = useTemplateRef("root");
    const [isDrop, toggleDrop] = useToggle(false);

    const indexedItems = computed(() => {
        return Object.fromEntries(
            props.options
                .filter((item) => !item.group)
                .map((item) => [item.value, item]),
        );
    });

    const activeItem = computed(() => {
        return indexedItems.value[modelValue.value];
    });

    function selectItem(value: T) {
        modelValue.value = value;
        rootEl.value?.blur();
    }
</script>

<template>
    <div
        ref="root"
        class="mb-select"
        tabindex="0"
        @focus="toggleDrop(true)"
        @blur="toggleDrop(false)"
    >
        <span class="select-title">{{ activeItem?.label }}</span>
        <iconify class="select-arrow" :class="{ [`is-reverse`]: isDrop }" name="fa6-solid:chevron-down"/>
        <ul class="select-dropdown" :class="{ [`is-drop`]: isDrop }">
            <template v-for="{ label, group, value } in options">
                <li v-if="group" class="select-group">{{ label }}</li>
                <li
                    v-else
                    class="select-option"
                    :class="{
                        [`is-checked`]: modelValue === value,
                    }"
                    @click="selectItem(value as T)"
                >
                    <span class="text-truncate">{{ label }}</span>
                </li>
            </template>
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
            color: var(--color-info);
        }
    }

    .select-arrow {
        color: var(--color-info);
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
        cursor: auto;

        &:not(.is-drop) {
            opacity: 0;
            scale: 1 0.66;
            pointer-events: none;
        }
    }

    .select-option {
        height: 2em;
        padding-inline: 12px;
        border-radius: 8px;
        line-height: 2em;
        cursor: pointer;

        &:hover {
            background-color: var(--color-gray-800);
        }

        &.is-checked {
            color: var(--color-theme-text);
        }
    }

    .select-group {
        padding: 6px 12px;
        font-size: 12px;
        color: var(--color-info);
    }
</style>
