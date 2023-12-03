<script setup>
    const imageViewerStore = useImageViewerStore();
    const $i = storeToRefs(imageViewerStore).target;
    const $v = ref();

    //放大后占窗口比率
    const rate = 0.9;

    //鼠标是否按住，起始位置
    let isPressing = false;
    let mouseX = 0;
    let mouseY = 0;
    let imageX = 0;
    let imageY = 0;

    const animationOptions = {
        duration: 400,
        easing: "ease",
        fill: "forwards"
    };

    //图片样式
    const imageStyle = ref({
        top: 0,
        left: 0,
        width: 0,
        height: 0
    });

    const $img = computed(() => {
        return $v.value.$el;
    });

    //按下ESC键关闭
    useEventListener("keydown", (event) => {
        if (imageViewerStore.state && event.key === "Escape") {
            closeViewer();
        }
    });

    //打开时
    watch(() => imageViewerStore.state, (state) => {
        if (!state) return;

        //起始位置
        const { left, top, width, height } = $i.value.getBoundingClientRect();
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
        const [finalWidth, finalHeight] = {
            [false]: [fixedWidth, fixedWidth / ratio],
            [true]: [fixedHeight * ratio, fixedHeight]
        }[fixedWidth / fixedHeight > ratio];

        //移动至屏幕中心
        nextTick(() => {
            $img.value.animate({
                top: `calc(50% - ${Math.floor(finalHeight / 2)}px)`,
                left: `calc(50% - ${Math.floor(finalWidth / 2)}px)`,
                width: Math.floor(finalWidth) + "px",
                height: Math.floor(finalHeight) + "px"
            }, animationOptions);
        });
    });

    //关闭时
    function closeViewer() {
        imageViewerStore.close();

        //开始关闭
        isPressing = true;

        //回到原位
        const { left, top, width, height } = $i.value.getBoundingClientRect();
        const animation = $img.value.animate({
            top: top + "px",
            left: left + "px",
            width: width + "px",
            height: height + "px"
        }, animationOptions);

        //结束关闭
        animation.onfinish = () => {
            isPressing = false;
        };
    }

    function onMouseDown(event) {
        if (event.button === 0) {
            event.preventDefault();
            isPressing = true;
            mouseX = event.pageX;
            mouseY = event.pageY;
            ({
                left: imageX,
                top: imageY
            } = $img.value.getBoundingClientRect());
        }
    }

    //鼠标移动时
    useEventListener("mousemove", (event) => {
        if (imageViewerStore.state && isPressing && event.button === 0) {
            $img.value.animate({
                top: imageY - mouseY + event.pageY + "px",
                left: imageX - mouseX + event.pageX + "px"
            }, {
                duration: 0,
                fill: "forwards"
            });
        }
    });

    //鼠标松开时
    useEventListener("mouseup", () => {
        isPressing = false;
    });

    //鼠标滚动时
    function onMouseWheel(event) {
        if (isPressing) return;

        //缩放比率
        const rate = event.deltaY < 0 ? 1.5 : 0.667;

        const { left, top, width, height } = $img.value.getBoundingClientRect();
        const finalX = left - (event.clientX - left) * ((rate - 1) / 1);
        const finalY = top - (event.clientY - top) * ((rate - 1) / 1);

        $img.value.animate({
            left: finalX + "px",
            top: finalY + "px",
            width: width * rate + "px",
            height: height * rate + "px"
        }, animationOptions);
    }
</script>

<template>
    <transition name="move">
        <nuxt-img
            v-if="imageViewerStore.state"
            class="mb-image-viewer"
            ref="$v"
            :src="$i.src"
            :style="imageStyle"
            @mousedown="onMouseDown"
            @mousewheel.prevent="onMouseWheel"
        />
    </transition>
    <mb-mask :when="imageViewerStore.state" z="511" @click="closeViewer" @mousewheel.prevent></mb-mask>
</template>

<style lang="scss" scoped>
    .mb-image-viewer {
        position: fixed;
    }

    .move-enter-active, .move-leave-active {
        transition: all 0.4s;
    }
</style>