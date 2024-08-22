<script lang="ts" setup>
    const props = withDefaults(defineProps<{
        accuracy?: number;
        trim?: boolean;
    }>(), {
        accuracy: 0
    });
    const modelValue = defineModel<number>();

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
        if (match) {
            const d = match[2]?.slice(0, props.accuracy + 1) || "";

            oldDisplayValue = match[1] + d;
            oldValue = Number(oldDisplayValue) || 0;
            modelValue.value = oldValue;
        }
        toggleValid(!!match);
    }

    //失焦时
    function blur() {
        const match = oldDisplayValue.match(NUMBER_REGEX);
        const i = Number(match[1]) || (match[1] === "-" ? "-0" : "0");

        let d = match[2] || ".";
        if (props.accuracy) {
            d = d.padEnd(props.accuracy + 1, "0").slice(0, props.accuracy + 1);
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
    <mb-input
        :class="{ [`is-invalid`]: !isValid }"
        v-model="displayValue"
        @input="input"
        @blur="blur"
    />
</template>