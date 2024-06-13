<script lang="ts" setup>
    const props = withDefaults(defineProps<{
        accuracy?: number;
        readonly?: boolean;
        trim?: boolean;
    }>(), {
        accuracy: 0
    });
    const modelValue = defineModel<number>();

    const NUMBER_REGEX = /^(\d*)(\.\d*)?$/;

    //组件根元素
    const displayValue = ref("");
    const [isValid, toggleValid] = useToggle(false);

    //记录旧值
    let oldValue: string,
        oldNumberValue: number;

    //响应源数据变化
    watchImmediate(modelValue, (val) => {
        if (val !== oldNumberValue) {
            oldValue = String(val);
            blur();
        }
    });

    //输入时
    function input() {
        const match = displayValue.value.match(NUMBER_REGEX);
        if (match) {
            const d = match[2]?.slice(0, props.accuracy + 1) || "";

            oldValue = match[1] + d;
            oldNumberValue = Number(oldValue) || 0;
            modelValue.value = oldNumberValue;
        }
        toggleValid(!!match);
    }

    //失焦时
    function blur() {
        const match = oldValue.match(NUMBER_REGEX);
        const i = Number(match[1]) || "0";

        let d = match[2] || ".";
        d = props.trim
            ? d.replace(/0+$/, "")
            : props.accuracy
                ? d.padEnd(props.accuracy + 1, "0")
                : d;
        d === "." && (d = "");

        //规整格式
        displayValue.value = i + d;
        toggleValid(true);
    }
</script>

<template>
    <input
        class="mb-input"
        :class="{ [`is-invalid`]: !isValid }"
        :readonly
        v-model="displayValue"
        @input="input"
        @blur="blur"
    />
</template>