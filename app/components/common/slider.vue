<script lang="ts" setup>
    const props = withDefaults(defineProps<{
        min?: number;
        max?: number;
        step?: number;
    }>(), {
        min: 0,
        max: 1
    });
    const modelValue = defineModel<number>();
    const emit = defineEmits<{
        progress: [rate: number];
        change: [rate: number];
        dragstart: [];
        dragend: [];
    }>();

    const rootEl = useTemplateRef("root");
    const rate = ref(0);

    watchEffect(() => {
        rate.value = props.max > props.min
            ? (modelValue.value - props.min) / (props.max - props.min)
            : props.min > 0 ? 1 : 0;
    });

    let current = modelValue.value;
    let width = 0;
    let left = 0;

    //鼠标拖动时
    useHold(rootEl, {
        onPointerdown(event) {
            ({ width, left } = rootEl.value.getBoundingClientRect());
            emit("dragstart");

            //进度预变化
            this.onPointermove(event);
        },
        onPointermove(event) {
            const { min, max, step } = props;

            rate.value = Math.max(0, Math.min(1, (event.clientX - left) / width));
            current = rate.value * (max - min) + min;

            if (step) {
                current = Math.round(current / step) * step;
                rate.value = (current - min) / (max - min);
            }
            modelValue.value = current;
            emit("progress", current);
        },
        onPointerup() {
            modelValue.value = current;
            emit("dragend");
            emit("change", current);
        }
    });
</script>

<template>
    <div ref="root" class="mb-slider">
        <div class="slider-track">
            <div class="slider-rate" :style="{ scale: `${rate} 1` }"></div>
        </div>
        <span class="slider-thumb" :style="{ marginLeft: `${rate * 100}%` }"></span>
    </div>
</template>

<style lang="scss" scoped>
    .mb-slider {
        display: grid;
        align-items: center;
        position: relative;
        width: calc(100% - 16px);
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
        border-radius: var(--bounded-full);
        background-color: color-mix(in srgb, var(--color-gray-500), transparent 50%);
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
        border-radius: var(--bounded-circle);
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