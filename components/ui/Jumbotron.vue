<script setup>
    const title = ref({
        main: "",
        sub: "",
        isMainTyping: false,
        isSubTyping: false
    });

    const style = ref({
        translate: 0
    });

    if (process.browser) {
        let x, y;
        const bg_func = Zin.throttle((event) => {
            if (window.scrollY > window.innerHeight) return;
            if (event.x && event.y) {
                x = (window.innerWidth / 2 - event.x) / 20;
                y = (window.innerHeight / 2 - event.y) / 20;
            }

            //滑动时强制更新
            style.value = { translate: `${x}px ${y + window.scrollY}px` };
        });

        //背景相对鼠标移动与视差
        window.addEventListener("mousemove", bg_func);
        window.addEventListener("scroll", bg_func);

        //释放内存
        onUnmounted(() => {
            window.removeEventListener("mousemove", bg_func);
            window.removeEventListener("scroll", bg_func);
        });
    }

    //标题打字特效
    (async () => {
        const main = "微光茶館";
        const sub = "微かの力を尽くして、光の導いた彼方へ";

        //主标题
        title.value.isMainTyping = true;
        await Zin.setInterval((t) => {
            title.value.main = main.slice(0, t);
        }, {
            duration: 150,
            times: main.length + 1
        });
        title.value.isMainTyping = false;

        //副标题
        title.value.isSubTyping = true;
        await Zin.setInterval((t) => {
            title.value.sub = sub.slice(0, t);
        }, {
            duration: 125,
            times: sub.length + 1
        });
        title.value.isSubTyping = false;
    })();

    //点击箭头
    function toBottom() {
        window.scrollTo({
            top: window.innerHeight * 0.72,
            behavior: "smooth"
        });
    }
</script>

<template>
    <div class="z-jumbotron">
        <div class="jumbo-background" :style="style"></div>
        <div class="jumbo-banner">
            <div class="title" :class="{ [`main-typing`]: title.isMainTyping }">{{ title.main }}</div>
            <div class="sub" :class="{ [`sub-typing`]: title.isSubTyping }">{{ title.sub }}</div>
        </div>
        <div class="jumbo-hide" @click="toBottom">
            <i class="fas fa-chevron-down"></i>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .z-jumbotron {
        position: relative;
        overflow: hidden;
    }

    .jumbo-background {
        height: 72vh;
        background-image: url("/garden/jumbotron.webp");
        background-position: center;
        background-size: cover;
        scale: 1.1;
    }

    .jumbo-banner {
        display: grid;
        align-content: center;
        position: absolute;
        inset: 0;
        font-family: "Noto Serif JP";
        text-align: center;
        text-shadow: 0 0 12px rgb(0 0 0 / 66%);
        color: white;

        .title {
            font-size: 72px;
            line-height: 80px;
        }

        .sub {
            height: 30px;
            margin-top: 8px;
            font-size: 24px;
        }
    }

    .main-typing::after, .sub-typing::after {
        content: "";
        display: inline-block;
        outline: 1px solid white;
        animation: cursor-flash 1s;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
    }

    .main-typing::after {
        height: 52px;
        transform: translate(6px, 4px);
    }

    .sub-typing::after {
        height: 18px;
        transform: translateX(6px);
    }

    @keyframes cursor-flash {
        0% {
            opacity: 0;
        }

        15% {
            opacity: 1;
        }

        50% {
            opacity: 1;
        }

        65% {
            opacity: 0;
        }

        100% {
            opacity: 0;
        }
    }

    .jumbo-hide {
        display: flex;
        position: absolute;
        opacity: 0;
        bottom: 0;
        width: 100%;
        height: 20%;
        background: linear-gradient(transparent, rgb(0 0 0 / 50%));
        transition: all 0.3s;
        cursor: pointer;

        &:hover {
            opacity: 1;
        }

        > i {
            margin: auto;
            font-size: 64px;
            color: rgb(255 255 255 / 45%);
        }
    }
</style>