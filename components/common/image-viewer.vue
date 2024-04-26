<script lang="ts" setup>
    const imageViewerStore = useImageViewerStore();
    const $origin = storeToRefs(imageViewerStore).target;
    const $viewer = ref();
    const $image = computed(() => {
        return $viewer.value.$el;
    });

    //添加遮罩层
    useMask({
        isOpened: () => imageViewerStore.isOpened,
        onClick: () => closeViewer()
    });

    //放大后占窗口比率
    const rate = 0.9;

    //起始位置
    let mouseX = 0;
    let mouseY = 0;
    let imageX = 0;
    let imageY = 0;

    //图片样式
    const imageStyle = ref({
        top: "",
        left: "",
        width: "",
        height: ""
    });

    //鼠标拖动时
    const { isPressed } = useHold($viewer, {
        filter: (event) => event.button === 0,
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
            if (imageViewerStore.isOpened) {
                $image.value.animate({
                    top: imageY - mouseY + event.pageY + "px",
                    left: imageX - mouseX + event.pageX + "px"
                }, {
                    duration: 0,
                    fill: "forwards"
                });
            }
        }
    });

    //按下ESC键关闭
    useEventListener("keydown", (event) => {
        if (imageViewerStore.isOpened && event.key === "Escape") {
            closeViewer();
        }
    });

    //打开时
    watch(() => imageViewerStore.isOpened, (state) => {
        if (!state) return;

        //起始位置
        const { left, top, width, height } = $origin.value.getBoundingClientRect();
        imageStyle.value.left = left + "px";
        imageStyle.value.top = top + "px";

        //尺寸
        imageStyle.value.width = width + "px";
        imageStyle.value.height = height + "px";

        //最大宽高
        const fixedWidth = window.innerWidth * rate;
        const fixedHeight = window.innerHeight * rate;

        //计算最终宽高
        const ratio = width / height;
        const [finalWidth, finalHeight] = (fixedWidth / fixedHeight > ratio)
            ? [fixedHeight * ratio, fixedHeight]
            : [fixedWidth, fixedWidth / ratio];

        //移动至屏幕中心
        nextTick(() => {
            $image.value.animate({
                top: `calc(50% - ${Math.floor(finalHeight / 2)}px)`,
                left: `calc(50% - ${Math.floor(finalWidth / 2)}px)`,
                width: Math.floor(finalWidth) + "px",
                height: Math.floor(finalHeight) + "px"
            }, Zin.DEFAULT_ANIME_OPTION);
        });
    });

    //关闭时
    function closeViewer() {
        if (!imageViewerStore.isOpened) return;
        imageViewerStore.close();

        //回到原位
        const { left, top, width, height } = $origin.value.getBoundingClientRect();
        const { scrollX: x, scrollY: y } = window;

        $image.value.animate([{
            top: y + $image.value.y + "px",
            left: x + $image.value.x + "px"
        }, {
            top: y + top + "px",
            left: x + left + "px",
            width: width + "px",
            height: height + "px"
        }], Zin.DEFAULT_ANIME_OPTION);
    }

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
</script>

<template>
    <transition name="move">
        <nuxt-img
            v-if="imageViewerStore.isOpened"
            ref="$viewer"
            class="mb-image-viewer"
            :src="$origin.src"
            :style="imageStyle"
            @mousewheel.prevent="onMouseWheel"
        />
    </transition>
</template>

<style lang="scss" scoped>
    .mb-image-viewer {
        position: fixed;
        transition: all 0.4s;
    }

    .move-leave-active {
        position: absolute;
        pointer-events: none;
    }
</style>