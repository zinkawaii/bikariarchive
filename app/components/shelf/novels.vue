<script lang="ts" setup>
    import { transition } from "@vueuse/core";

    const shelfStore = useShelfStore();
    const { novel, novels } = storeToRefs(shelfStore);

    const currentNovelIdx = computed(() => {
        return novels.value.indexOf(novel.value);
    });

    const width = -144;
    const translateX = ref(currentNovelIdx.value * width);
    const rootEl = useTemplateRef("root");

    let min = 0;
    let start = 0;
    let mouseX = 0;

    const { isHolding } = usePointer(rootEl, {
        onPointerdown(event) {
            min = (novels.value.length - 1) * width;
            start = translateX.value;
            mouseX = event.x;
        },
        onPointermove(event) {
            const delta = event.x - mouseX;
            const end =
                start > 0 ? start ** (4 / 3) + delta :
                start < min ? min - (min - start) ** (4 / 3) + delta :
                start + delta;

            translateX.value =
                end > 0 ? end ** 0.75 :
                end < min ? min - (min - end) ** 0.75 :
                end;
        },
        onPointerup() {
            const raw = (translateX.value - 72) / width;
            const index = clamp(0, Math.floor(raw), novels.value.length - 1);

            if (index !== currentNovelIdx.value) {
                shelfStore.selectNovel(novels.value[index]);
            }
            else {
                nextTick(() => {
                    move(index);
                });
            }
        },
    });

    watch(currentNovelIdx, move);

    function move(index: number) {
        transition(translateX, translateX.value, index * width, {
            duration: 400,
            transition: [0.25, 0.1, 0.25, 1],
            abort() {
                return isHolding.value;
            },
        });
    }

    const throttledSelectNovel = Zin.throttle((delta: number) => {
        const raw = currentNovelIdx.value + Math.sign(delta);
        const idx = clamp(0, raw, novels.value.length - 1);
        shelfStore.selectNovel(novels.value[idx]);
    }, 250);

    function onWheel(event: WheelEvent) {
        const delta = event.shiftKey ? event.deltaY : event.deltaX;
        if (Math.abs(delta) > 0) {
            event.preventDefault();
        }
        if (Math.abs(delta) >= 4) {
            throttledSelectNovel(delta);
        }
    }
</script>

<template>
    <div ref="root" class="shelf-novels" @wheel="onWheel">
        <ul
            class="shelf-slides"
            :class="{ [`is-holding`]: isHolding && translateX !== start }"
            :style="{ translate: `${translateX}px` }"
        >
            <shelf-novel
                v-for="(novelInfo, key) in Article.meta"
                :key
                :novel="key"
                v-bind="novelInfo"
            />
        </ul>
    </div>
</template>

<style lang="scss" scoped>
    .shelf-novels {
        overflow: hidden;
        padding-left: calc(50% - 72px);
        mask-image: linear-gradient(to right, transparent, white 2rem, white calc(100% - 2rem), transparent);
        touch-action: none;
        user-select: none;
    }

    .shelf-slides {
        display: flex;

        &.is-holding {
            pointer-events: none;
        }
    }
</style>
