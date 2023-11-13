<script lang="ts" setup>
    const emit = defineEmits([
        "update:modelValue",
        "progress",
        "change",
        "dragstart",
        "dragend"
    ]);
    const props = defineProps<{
        modelValue: number,
        title: string
    }>();

    let oldValue = 0;
    let p_width = 0;
    let p_left = 0;
    const self = ref();
    const rate = ref(0);
    const dragging = ref(false);

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
        progressChange(event);
    }

    if (process.browser) {
        //鼠标移动时
        document.addEventListener("mousemove", progressChange);

        //鼠标松开时
        document.addEventListener("mouseup", () => {
            if (dragging.value) {
                emit("dragend");
                emit("update:modelValue", rate.value);
                emit("change", { rate: rate.value });
                dragging.value = false;
            }
        });
    }

    function progressChange(event) {
        if (dragging.value) {
            rate.value = Math.max(0, Math.min(1, (event.clientX - p_left) / p_width));
            emit("progress", { rate: rate.value });
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