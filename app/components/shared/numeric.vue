<script lang="ts" setup>
    export interface MbNumericProps {
        title?: string;
        initialValue?: number;
        min?: number;
        max: number;
    }

    const props = withDefaults(defineProps<MbNumericProps>(), {
        title: "选择",
        initialValue: 0,
        min: 0,
    });
    const emit = defineEmits<{
        close: [value: number];
    }>();

    const currentValue = ref(props.initialValue);

    function cancel() {
        emit("close", props.initialValue);
    }

    function confirm() {
        emit("close", currentValue.value);
    }
</script>

<template>
    <mb-dialog class="mb-numeric" @close="cancel">
        <meow-title>{{ title }}</meow-title>
        <div class="numeric-editor">
            <mb-button
                :disabled="currentValue <= min"
                @click="currentValue = min"
            >最小</mb-button>
            <mb-input-number
                :accuracy="0"
                :min
                :max
                controls
                v-model="currentValue"
                @keyup.enter="confirm"
            />
            <mb-button
                :disabled="currentValue >= max"
                @click="currentValue = max"
            >最大</mb-button>
        </div>
        <div class="numeric-selector">
            <span
                class="numeric-limit"
                :class="{ [`is-equal`]: currentValue === min }"
            >{{ min }}</span>
            <mb-slider
                :min
                :max
                :step="1"
                v-model="currentValue"
            />
            <span
                class="numeric-limit"
                :class="{ [`is-equal`]: currentValue === max }"
            >{{ max }}</span>
        </div>
        <div class="numeric-operator">
            <mb-button @click="cancel">取消</mb-button>
            <mb-button @click="confirm">确定</mb-button>
        </div>
    </mb-dialog>
</template>

<style lang="scss" scoped>
    .mb-numeric {
        --dialog-padding: 1rem 1.5rem;

        font-size: 14px;
    }

    .numeric-editor {
        display: flex;
        align-items: center;
        gap: 16px;
        margin: 16px 24px;
    }

    .numeric-selector {
        display: flex;
        gap: 8px;
        margin-block: 16px;
    }

    .numeric-limit {
        transition: color 0.25s;

        &.is-equal {
            color: var(--color-theme-text);
        }
    }

    .numeric-operator {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
    }
</style>
