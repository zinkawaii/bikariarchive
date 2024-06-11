<script lang="ts" setup>
    const props = defineProps<{
        target: HTMLImageElement;
        opening?: boolean;
    }>();
    const emit = defineEmits<{
        close: [];
    }>();

    const $self = ref();
    const $image = computed<HTMLImageElement>(() => {
        return unrefElement($self);
    });

    //放大后占窗口比率
    const rate = 0.9;

    //起始位置
    let mouseX = 0;
    let mouseY = 0;
    let imageX = 0;
    let imageY = 0;

    //鼠标拖动时
    const { isPressed } = useHold($self, {
        onMousedown(event) {
            event.preventDefault();
            mouseX = event.pageX;
            mouseY = event.pageY;
            ({
                left: imageX,
                top: imageY
            } = $image.value.getBoundingClientRect());
        },
        onMousemove(event) {
            $image.value.animate({
                top: imageY - mouseY + event.pageY + "px",
                left: imageX - mouseX + event.pageX + "px"
            }, {
                duration: 0,
                fill: "forwards"
            });
        }
    });

    //鼠标滚动时
    function onMouseWheel(event: WheelEvent) {
        if (isPressed.value) return;

        //缩放比率
        const rate = event.deltaY < 0 ? 1.5 : 0.667;

        const { left, top, width, height } = $image.value.getBoundingClientRect();
        const finalX = left - (event.clientX - left) * ((rate - 1) / 1);
        const finalY = top - (event.clientY - top) * ((rate - 1) / 1);

        $image.value.animate({
            left: finalX + "px",
            top: finalY + "px",
            width: width * rate + "px",
            height: height * rate + "px"
        }, Zin.DEFAULT_ANIME_OPTION);
    }

    //按下ESC键关闭
    useEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            emit("close");
        }
    });

    //打开时
    function onEnter(el: HTMLImageElement) {
        //起始位置
        const { left, top, width, height } = props.target.getBoundingClientRect();

        //最大宽高
        const fixedWidth = window.innerWidth * rate;
        const fixedHeight = window.innerHeight * rate;

        //计算最终宽高
        const ratio = width / height;
        const [finalWidth, finalHeight] = (fixedWidth / fixedHeight > ratio)
            ? [fixedHeight * ratio, fixedHeight]
            : [fixedWidth, fixedWidth / ratio];

        //移动至屏幕中心
        el.animate([{
            top: top + "px",
            left: left + "px",
            width: width + "px",
            height: height + "px"
        }, {
            top: `calc(50% - ${Math.floor(finalHeight / 2)}px)`,
            left: `calc(50% - ${Math.floor(finalWidth / 2)}px)`,
            width: Math.floor(finalWidth) + "px",
            height: Math.floor(finalHeight) + "px"
        }], Zin.DEFAULT_ANIME_OPTION);
    }

    //关闭时
    function onLeave(el: HTMLImageElement) {
        const { left, top, width, height } = props.target.getBoundingClientRect();
        const { scrollX: x, scrollY: y } = window;

        //回到原位
        el.animate([{
            top: 2 * y + el.y + "px",
            left: 2 * x + el.x + "px"
        }, {
            top: y + top + "px",
            left: x + left + "px",
            width: width + "px",
            height: height + "px"
        }], Zin.DEFAULT_ANIME_OPTION);
    }
</script>

<template>
    <transition @enter="onEnter" @leave="onLeave">
        <nuxt-img
            v-if="opening"
            ref="$self"
            class="image-viewer"
            :src="target.src"
            @mousewheel.prevent="onMouseWheel"
        />
    </transition>
</template>

<style lang="scss" scoped>
    .image-viewer {
        position: fixed;
        transition: all 0.4s;

        &.v-leave-active {
            position: absolute;
            pointer-events: none;
        }
    }
</style>