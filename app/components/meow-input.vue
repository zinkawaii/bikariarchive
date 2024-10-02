<script lang="ts" setup>
    defineOptions({
        inheritAttrs: false
    });
    const props = defineProps<{
        value?: string;
        placeholder: string;
    }>();
    const modelValue = defineModel<string>();
    const error = defineModel<boolean>("error");

    const inputValue = computed<string>({
        get() {
            return modelValue.value ?? props.value;
        },
        set(val) {
            (props.value === void 0) && (modelValue.value = val);
        }
    });
</script>

<template>
    <div class="meow-input">
        <input class="input-entity" required title="" v-bind="$attrs" v-model="inputValue" @blur="error = false"/>
        <span class="input-underline"></span>
        <span class="input-placeholder" :class="{ [`is-error`]: error }">{{ placeholder }}</span>
    </div>
</template>

<style lang="scss" scoped>
    .meow-input {
        display: grid;
        position: relative;
        line-height: 20px;
    }

    .input-entity {
        padding: 4px;

        &:where(:focus) {
            ~ .input-underline::before {
                width: 100%;
            }

            ~ .input-placeholder {
                color: var(--color-theme-text);
            }
        }

        &:where(:focus, :valid) {
            ~ .input-placeholder {
                top: -1em;
                font-size: 12px;
                line-height: 1em;
            }
        }
    }

    .input-underline {
        height: 1px;
        background-color: var(--color-border-lighter);

        &::before {
            content: "";
            display: block;
            width: 0;
            height: 1px;
            background-color: var(--color-theme-dark);
            transition: all 0.4s;
        }
    }

    .input-placeholder {
        position: absolute;
        top: 4px;
        left: 4px;
        color: var(--color-text-info);
        transition: all 0.25s;
        pointer-events: none;

        &.is-error {
            color: var(--color-danger);
        }
    }
</style>