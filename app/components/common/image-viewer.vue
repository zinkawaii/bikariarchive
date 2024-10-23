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
    const rootEl = useCurrentElement(rootComp);

    //放大后占窗口比率
    const rate = 0.9;

    //起始位置
    let mouseX = 0;
    let mouseY = 0;
    let imageX = 0;
    let imageY = 0;

    //鼠标拖动时
    const { isHolding } = useHold(rootEl, {
        onPointerdown(event) {
            mouseX = event.pageX;
            mouseY = event.pageY;
            ({
                left: imageX,
                top: imageY
            } = rootEl.value.getBoundingClientRect());
        },
        onPointermove(event) {
            rootEl.value.animate({
                top: imageY - mouseY + event.pageY + "px",
                left: imageX - mouseX + event.pageX + "px"
            }, {
                duration: 0,
                fill: "forwards"
            });
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
        const finalX = left - (event.clientX - left) * (rate - 1);
        const finalY = top - (event.clientY - top) * (rate - 1);

        rootEl.value.animate({
            left: finalX + "px",
            top: finalY + "px",
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
    const onLeave: BaseTransitionProps<HTMLImageElement>["onLeave"] = (el) => {
        const { left: elLeft, top: elTop } = el.getBoundingClientRect();
        const { scrollX: x, scrollY: y } = window;

        //回到原位
        el.animate([{
            top: 2 * y + elTop + "px",
            left: 2 * x + elLeft + "px",
            clipPath: "inset(0)"
        }, getOriginalKeyframe(x, y)], Zin.DEFAULT_ANIME_OPTION);
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
        transition: all 0.4s;
        touch-action: none;

        &.v-leave-active {
            position: absolute;
            pointer-events: none;
        }
    }
</style>