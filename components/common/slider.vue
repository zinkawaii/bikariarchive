<script lang="ts" setup>
    defineProps<{
        title: string;
    }>();
    const emit = defineEmits<{
        progress: [rate: number];
        change: [rate: number];
        dragstart: [];
        dragend: [];
    }>();
    const modelValue = defineModel<number>();

    let p_width = 0;
    let p_left = 0;
    const $self = ref();
    const rate = ref(0);

    //鼠标拖动时
    const { isPressed } = useHold($self, {
        onMousedown(event) {
            ({
                width: p_width,
                left: p_left
            } = $self.value.getBoundingClientRect());
            emit("dragstart");

            //进度预变化
            this.onMousemove(event);
        },
        onMousemove(event) {
            rate.value = Math.max(0, Math.min(1, (event.clientX - p_left) / p_width));
            emit("progress", rate.value);
        },
        onMouseup() {
            modelValue.value = rate.value;
            emit("dragend");
            emit("change", rate.value);
        }
    });

    //显示的进度
    const displayRate = computed(() => {
        return Math.max(0, Math.min(1, isPressed.value ? rate.value : modelValue.value));
    });
</script>

<template>
    <div ref="$self" class="mb-slider">
        <div class="slider-track">
            <div class="slider-rate" :style="{ scale: `${displayRate} 1` }"></div>
        </div>
        <span class="slider-thumb" :style="{ marginLeft: `${displayRate * 100}%` }"></span>
    </div>
</template>

<style lang="scss" scoped>
    .mb-slider {
        display: inline-grid;
        align-items: center;
        position: relative;
        height: 20px;
        margin-inline: 8px;
        cursor: pointer;
        user-select: none;
    }

    .slider-track {
        display: grid;
        position: absolute;
        overflow: hidden;
        inset: 4px 0;
        border-radius: var(--circle-radius);
    }

    .slider-rate {
        background-color: var(--color-theme);
        transform-origin: left;
    }

    .slider-thumb {
        position: absolute;
        opacity: 0;
        width: 20px;
        aspect-ratio: 1;
        border: 2px solid var(--color-theme-dark);
        border-radius: 100%;
        box-shadow: var(--box-shadow);
        outline: 0 solid color-mix(in srgb, var(--color-theme-dark), transparent 66%);
        background-color: var(--color-background);
        transition-property: opacity, outline;
        transition-duration: 0.2s;
        translate: -50%;

        :where(:active, :hover) > & {
            opacity: 1;
        }

        :active > & {
            outline-width: 10px;
        }
    }
</style>