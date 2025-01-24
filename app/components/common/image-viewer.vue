<script lang="ts" setup>
    import type { BaseTransitionProps } from "vue";

    const props = defineProps<{
        target: HTMLImageElement;
        isOpening?: boolean;
    }>();
    const emit = defineEmits<{
        close: [];
    }>();

    const rootComp = useTemplateRef("root");
    const rootEl = computed(() => rootComp.value?.$refs.imgEl);

    //放大后占窗口比率
    const rate = 0.9;

    interface Pointer {
        startX: number;
        startY: number;
        currentX: number;
        currentY: number;
    }

    //起始位置和尺寸
    let startRect: DOMRect;

    //起始中心位置
    let startCenter: typeof center.value;

    //起始两指距离
    let startDistance: typeof distance.value;

    //指针数据
    const pointers = ref<Record<number, Pointer>>({});

    //双指数据
    const fingers = computed(() => {
        return Object.values(pointers.value).slice(0, 2);
    });

    //当前中心位置
    const center = computed(() => getCenter("current"));

    //当前两指距离
    const distance = computed(() => getDistance("current"));

    //获取中心位置
    function getCenter(mode: "start" | "current") {
        return {
            x: fingers.value.reduce((sum, finger) => sum + finger[mode + "X"], 0) / fingers.value.length,
            y: fingers.value.reduce((sum, finger) => sum + finger[mode + "Y"], 0) / fingers.value.length
        };
    }

    //获取两指距离
    function getDistance(mode: "start" | "current") {
        const [finger1, finger2] = fingers.value;
        return finger2 ? Math.hypot(
            finger1[mode + "X"] - finger2[mode + "X"],
            finger1[mode + "Y"] - finger2[mode + "Y"]
        ) : 0;
    }

    //初始化
    function initialize() {
        for (const pointer of Object.values(pointers.value)) {
            pointer.startX = pointer.currentX;
            pointer.startY = pointer.currentY;
        }

        startRect = rootEl.value.getBoundingClientRect();
        startCenter = getCenter("start");
        startDistance = getDistance("start");
    }

    //鼠标拖动时
    const { isHolding } = usePointer(rootEl, {
        onPointerdown(event) {
            pointers.value[event.pointerId] = {
                startX: event.screenX,
                startY: event.screenY,
                currentX: event.screenX,
                currentY: event.screenY
            };
            initialize();
        },
        onPointermove(event) {
            const pointer = pointers.value[event.pointerId];
            if (!pointer) {
                return;
            }
            pointer.currentX = event.screenX;
            pointer.currentY = event.screenY;

            const rate = distance.value / startDistance || 1;
            const left = startRect.left + center.value.x - startCenter.x;
            const top = startRect.top + center.value.y - startCenter.y;
            const finalLeft = left - (center.value.x - left) * (rate - 1);
            const finalTop = top - (center.value.y - top) * (rate - 1);

            rootEl.value.animate({
                left: finalLeft + "px",
                top: finalTop + "px",
                width: startRect.width * rate + "px",
                height: startRect.height * rate + "px"
            }, {
                duration: 0,
                fill: "forwards"
            });
        },
        onPointerup(event) {
            delete pointers.value[event.pointerId];
            if (Object.keys(pointers.value).length) {
                initialize();
                return false;
            }
        }
    });

    //鼠标滚动时
    function onWheel(event: WheelEvent) {
        if (isHolding.value) return;

        //缩放比率
        let rate = 1 + Math.abs(event.deltaY) / 200;
        if (event.deltaY > 0) {
            rate = 1 / rate;
        }

        const { left, top, width, height } = rootEl.value.getBoundingClientRect();
        const finalLeft = left - (event.clientX - left) * (rate - 1);
        const finalTop = top - (event.clientY - top) * (rate - 1);

        rootEl.value.animate({
            left: finalLeft + "px",
            top: finalTop + "px",
            width: width * rate + "px",
            height: height * rate + "px"
        }, Zin.DEFAULT_ANIME_OPTION);
    }

    //按下 ESC 键关闭
    useEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            emit("close");
        }
    });

    //打开时
    const onEnter: BaseTransitionProps<HTMLImageElement>["onEnter"] = (el) => {
        //最大宽高
        const fixedWidth = window.innerWidth * rate;
        const fixedHeight = window.innerHeight * rate;

        //最终宽高
        const naturalRatio = props.target.naturalWidth / props.target.naturalHeight;
        const [finalWidth, finalHeight] = (fixedWidth / fixedHeight > naturalRatio)
            ? [fixedHeight * naturalRatio, fixedHeight]
            : [fixedWidth, fixedWidth / naturalRatio];

        //移动至屏幕中心
        el.animate([getOriginalKeyframe(), {
            top: `calc(50% - ${Math.floor(finalHeight / 2)}px)`,
            left: `calc(50% - ${Math.floor(finalWidth / 2)}px)`,
            width: Math.floor(finalWidth) + "px",
            height: Math.floor(finalHeight) + "px",
            clipPath: "inset(0)"
        }], Zin.DEFAULT_ANIME_OPTION);
    };

    //关闭时
    const onLeave: BaseTransitionProps<HTMLImageElement>["onLeave"] = (el, done) => {
        const { left: elLeft, top: elTop } = el.getBoundingClientRect();
        const { scrollX: x, scrollY: y } = window;

        //回到原位
        const animation = el.animate([{
            top: 2 * y + elTop + "px",
            left: 2 * x + elLeft + "px",
            clipPath: "inset(0)"
        }, getOriginalKeyframe(x, y)], Zin.DEFAULT_ANIME_OPTION);

        animation.addEventListener("finish", done);
    };

    //获取原始位置动画帧
    function getOriginalKeyframe(x = 0, y = 0) {
        const { left, top, width, height } = props.target.getBoundingClientRect();
        const { naturalWidth, naturalHeight } = props.target;
        const { objectPosition } = getComputedStyle(props.target);
        const [horizontal, vertical] = objectPosition.split(" ").map((pos) => Number(pos.slice(0, -1)) / 100);

        const ratio = width / height;
        const naturalRatio = naturalWidth / naturalHeight;

        let clipTop = 0;
        let clipBottom = 0;
        let clipLeft = 0;
        let clipRight = 0;

        if (ratio > naturalRatio) {
            const fullHeight = naturalHeight * width / naturalWidth;
            clipTop = (fullHeight - height) * vertical;
            clipBottom = fullHeight - height - clipTop;
        }
        else {
            const fullWidth = naturalWidth * height / naturalHeight;
            clipLeft = (fullWidth - width) * horizontal;
            clipRight = fullWidth - width - clipLeft;
        }

        return {
            top: (y + top - clipTop) + "px",
            left: (x + left - clipLeft) + "px",
            width: (width + clipLeft + clipRight) + "px",
            height: (height + clipTop + clipBottom) + "px",
            clipPath: `inset(${clipTop}px ${clipRight}px ${clipBottom}px ${clipLeft}px)`
        };
    }
</script>

<template>
    <transition @enter="onEnter" @leave="onLeave">
        <nuxt-img
            v-if="isOpening"
            ref="root"
            class="image-viewer"
            :src="target.src"
            :draggable="false"
            @wheel.prevent="onWheel"
        />
    </transition>
</template>

<style lang="scss" scoped>
    .image-viewer {
        position: fixed;
        touch-action: none;

        &.v-leave-active {
            position: absolute;
            pointer-events: none;
        }
    }
</style>