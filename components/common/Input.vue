<script setup>
    const emit = defineEmits(["update:modelValue"]);
    const props = defineProps({
        modelValue: {
            type: [String, Number],
            required: true
        },
        readonly: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: "text"
        },
        accuracy: {
            type: Number,
            default: 0
        }
    });

    const entity = ref();

    let oldValue = props.modelValue;

    //格式化器
    const formatter = new Proxy({
        //数字正则对象
        re: /^(\d*)(\.\d*)?$/,

        //输入时
        input(value) {
            const match = String(value).match(this.re);

            if (match) {
                let i = match[1] ?? "";
                let d = match[2] ?? "";

                //整数
                if (i === "") {
                    i = 0;
                }
                else if (i.length > 1 && i.startsWith("0")) {
                    i = i.slice(1);
                }

                //小数
                const accuracy = Number(props.accuracy);
                d = d.slice(0, accuracy + 1);

                return i + d;
            }
            else {
                return oldValue;
            }
        },

        //失焦时
        blur(value) {
            const match = String(value).match(this.re);

            if (match) {
                const i = match[1] ?? "";
                let d = match[2] ?? "";

                //小数
                const accuracy = props.accuracy;
                if (accuracy > 0) {
                    if (d === "") {
                        d = ".";
                    }
                    d = d.padEnd(accuracy + 1, "0");
                }

                return i + d;
            }
            else {
                return oldValue;
            }
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
            target: entity.value
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
        ref="entity"
        :value="modelValue"
        :readonly="readonly"
        @input="input"
        @blur="blur"
    />
</template>

<style lang="scss" scoped>
    input {
        flex: 1;
        width: 100%;
        border: 1px solid var(--color-border-light);
        border-radius: 4px;
        line-height: calc(2em - 2px);
        text-align: center;
    }
</style>