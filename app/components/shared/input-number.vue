<script lang="ts" setup>
    const props = withDefaults(defineProps<{
        accuracy?: number;
        min?: number;
        max?: number;
        step?: number;
        controls?: boolean;
        readonly?: boolean;
        trim?: boolean;
    }>(), {
        accuracy: 0,
        min: -Infinity,
        max: Infinity,
        step: 1,
    });
    const modelValue = defineModel<number>({
        required: true,
    });

    const NUMBER_REGEX = /^([-+]?\d*)(\.\d*)?$/;

    //组件根元素
    const displayValue = ref("");
    const [isValid, toggleValid] = useToggle(false);

    //记录旧值
    let oldValue: number,
        oldDisplayValue: string;

    //响应源数据变化
    watchImmediate(modelValue, (val) => {
        if (val !== oldValue) {
            oldDisplayValue = String(val);
            oldValue = val;
            blur();
        }
    });

    //输入时
    function input() {
        const match = displayValue.value.match(NUMBER_REGEX);
        if (!match) {
            toggleValid(false);
            return;
        }

        const d = match[2] || ".";
        if (d.length > props.accuracy + 1) {
            toggleValid(false);
            return;
        }

        const str = match[1] + d;
        const val = Number(str) || 0;
        if (val < props.min || val > props.max) {
            toggleValid(false);
            return;
        }

        oldDisplayValue = str;
        modelValue.value = oldValue = val;
        toggleValid(true);
    }

    //失焦时
    function blur() {
        const match = oldDisplayValue.match(NUMBER_REGEX)!;
        const i = Number(match[1]) || "0";

        let d = match[2] || ".";
        if (props.accuracy) {
            d = d.padEnd(props.accuracy + 1, "0");
        }
        if (props.trim) {
            d = d.replace(/0+$/, "");
        }
        d === "." && (d = "");

        //规整格式
        displayValue.value = i + d;
        toggleValid(true);
    }
</script>

<template>
    <div class="mb-input-number">
        <button
            v-if="controls"
            class="input-arrow"
            :class="{ [`is-disabled`]: readonly || modelValue - step < min }"
            @click="modelValue -= step"
        >
            <iconify name="fa6-solid:chevron-left"/>
        </button>
        <mb-input
            :invalid="!isValid"
            :readonly
            v-model="displayValue"
            @input="input"
            @blur="blur"
        />
        <button
            v-if="controls"
            class="input-arrow"
            :class="{ [`is-disabled`]: readonly || modelValue + step > max }"
            @click="modelValue += step"
        >
            <iconify name="fa6-solid:chevron-right"/>
        </button>
    </div>
</template>

<style lang="scss" scoped>
    .mb-input-number {
        position: relative;
    }

    .input-arrow {
        display: grid;
        place-items: center;
        position: absolute;
        top: 1px;
        height: calc(100% - 2px);
        aspect-ratio: 1;
        border: 1px solid transparent;
        background-color: var(--color-gray-900);
        color: var(--color-text-secondary);
        transition: color 0.25s;

        &:hover {
            color: var(--color-theme-text);
        }

        &:first-child {
            left: 1px;
            border-right-color: var(--color-border-light);
            border-radius: 6px 0 0 6px;
        }

        &:last-child {
            right: 1px;
            border-left-color: var(--color-border-light);
            border-radius: 0 6px 6px 0;
        }

        &.is-disabled {
            color: var(--color-text-disabled);
            pointer-events: none;
        }
    }
</style>
