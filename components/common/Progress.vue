<script setup>
    const props = defineProps([
        "title"
    ]);
    const emit = defineEmits([
        "progress",
        "change",
        "dragstart",
        "dragend"
    ]);
    const modelValue = defineModel();

    let p_width = 0;
    let p_left = 0;
    const self = ref();
    const rate = ref(0);

    //鼠标拖动时
    const { isPressed } = useHold(self, {
        filter: (event) => event.button === 0,
        onMousedown(event) {
            ({
                width: p_width,
                left: p_left
            } = self.value.getBoundingClientRect());
            emit("dragstart");

            //进度预变化
            this.onMousemove(event);
        },
        onMousemove(event) {
            rate.value = Math.max(0, Math.min(1, (event.clientX - p_left) / p_width));
            emit("progress", { rate: rate.value });
        },
        onMouseup() {
            modelValue.value = rate.value;
            emit("dragend");
            emit("change", { rate: rate.value });
        }
    });

    //显示的进度
    const displayRate = computed(() => {
        return Math.max(0, Math.min(1, isPressed.value ? rate.value : modelValue.value));
    });
</script>

<template>
    <div ref="self" class="mb-progress">
        <span class="progress-bar" :style="{ transform: `scaleX(${displayRate})` }"></span>
        <span class="text-truncate progress-title">{{ title }}</span>
    </div>
</template>

<style lang="scss" scoped>
    .mb-progress {
        display: inline-flex;
        position: relative;
        overflow: hidden;
        cursor: pointer;
    }

    .progress-bar {
        display: block;
        position: absolute;
        inset: 0;
        background-color: var(--color-theme);
        transform: scaleX(0);
        transform-origin: left;
    }

    .progress-title {
        opacity: 0.5;
        margin: auto;
        user-select: none;
    }
</style>