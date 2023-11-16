<script setup>
    const emit = defineEmits([
        "update:modelValue",
        "progress",
        "change",
        "dragstart",
        "dragend"
    ]);
    const props = defineProps([
        "modelValue",
        "title"
    ]);

    let p_width = 0;
    let p_left = 0;
    const self = ref();
    const rate = ref(0);
    const dragging = ref(false);

    //全局事件绑定
    useEventListener("mousemove", onMouseMove);
    useEventListener("mouseup", onMouseUp);

    //显示的进度
    const displayRate = computed(() => {
        return Math.max(0, Math.min(1, dragging.value ? rate.value : props.modelValue));
    });

    //鼠标按下时
    function onMouseDown(event) {
        ({
            width: p_width,
            left: p_left
        } = self.value.getBoundingClientRect());
        emit("dragstart");
        dragging.value = true;

        //进度预变化
        onMouseMove(event);
    }

    //鼠标移动时
    function onMouseMove(event) {
        if (dragging.value) {
            rate.value = Math.max(0, Math.min(1, (event.clientX - p_left) / p_width));
            emit("progress", { rate: rate.value });
        }
    }

    //鼠标松开时
    function onMouseUp() {
        if (dragging.value) {
            emit("dragend");
            emit("update:modelValue", rate.value);
            emit("change", { rate: rate.value });
            dragging.value = false;
        }
    }
</script>

<template>
    <div class="mb-progress" ref="self" @mousedown="onMouseDown">
        <span class="progress-bar" :style="{ transform: `scaleX(${displayRate})` }"></span>
        <span class="progress-title">{{ title }}</span>
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
        background-color: var(--color-theme-block);
        transform: scaleX(0);
        transform-origin: left;
    }

    .progress-title {
        overflow: hidden;
        opacity: 0.5;
        margin: auto;
        white-space: nowrap;
        text-overflow: ellipsis;
        user-select: none;
    }
</style>