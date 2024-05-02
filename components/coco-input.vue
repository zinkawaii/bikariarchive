<script lang="ts" setup>
    defineOptions({
        inheritAttrs: false
    });
    defineProps<{
        placeholder: string;
        warn?: boolean;
        warnTip?: string;
    }>();
    const modelValue = defineModel();
</script>

<template>
    <div class="coco-input">
        <input class="input-entity" required title="" v-bind="$attrs" v-model="modelValue"/>
        <div class="input-underline"></div>
        <span class="input-placeholder" :class="{ warn: warn || warnTip }">{{ warnTip || placeholder }}</span>
    </div>
</template>

<style lang="scss" scoped>
    .coco-input {
        display: grid;
        position: relative;
        line-height: 20px;
    }

    .input-entity {
        padding: 4px;
        background-color: transparent;

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

        &.warn {
            color: var(--color-danger);
        }
    }
</style>