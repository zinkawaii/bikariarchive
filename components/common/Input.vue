<script lang="ts" setup>
    const props = withDefaults(defineProps<{
        modelValue: string | number;
        readonly?: boolean;
        type?: string;
        accuracy?: number;
    }>(), {
        type: "text",
        accuracy: 0
    });
    const emit = defineEmits(["update:modelValue"]);

    //组件根元素
    const $self = ref();

    //更新前的旧值
    let oldValue = props.modelValue;

    //格式化器
    const formatter = new Proxy({
        //数字正则对象
        re: /^(\d*)(\.\d*)?$/,

        //输入时
        input(value) {
            const match = String(value).match(this.re);

            if (match) {
                const i = Number.parseInt(match[1]);
                const d = match[2]?.slice(0, props.accuracy + 1) || "";

                console.log(i, Number.isNaN(i), d, i + d);

                return Number.isNaN(i) ? d : i + d;
            }
            else return oldValue;
        },

        //失焦时
        blur(value) {
            const match = String(value).match(this.re);

            if (match) {
                const i = Number.parseInt(match[1]) || "0";
                const d = props.accuracy > 0 ? (match[2] || ".").padEnd(props.accuracy + 1, "0") : "";

                return i + d;
            }
            else return oldValue;
        }
    }, {
        get(target, p) {
            switch (props.type) {
                case "number": {
                    return target[p];
                }
                default: {
                    return (v) => v;
                }
            }
        }
    });

    //类型转换
    const toType = {
        number: (v) => Number(v),
        text: (v) => String(v)
    };

    //挂载完成时
    onMounted(() => {
        blur({
            target: $self.value
        });
    });

    //输入时
    function input(event) {
        //记录旧值
        oldValue = props.modelValue;

        //处理数据
        const value = formatter.input(event.target.value);

        //发送事件
        emit("update:modelValue", toType[props.type](value));

        //设置新值
        event.target.value = value;
    }

    //失焦时
    function blur(event) {
        //处理数据
        const value = formatter.blur(event.target.value);

        //设置新值
        event.target.value = value;
    }
</script>

<template>
    <input
        ref="$self"
        class="mb-input"
        :value="modelValue"
        :readonly
        @input="input"
        @blur="blur"
    />
</template>

<style lang="scss" scoped>
    .mb-input {
        flex: 1;
        width: 100%;
        border: 1px solid var(--color-border-light);
        border-radius: 4px;
        line-height: calc(2em - 2px);
        text-align: center;
    }
</style>