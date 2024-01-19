<script setup>
    const title = ref({
        main: "",
        sub: "",
        isMainTyping: false,
        isSubTyping: false
    });

    const style = ref({
        background: {
            translate: 0
        },
        title: {
            translate: 0
        }
    });

    //滚动视差
    useEventListener("scroll", Zin.throttle(() => {
        if (window.scrollY > window.innerHeight) return;

        style.value.background = { translate: `0 ${window.scrollY}px` };
        style.value.title = { translate: `0 ${window.scrollY / 2}px` };
    }));

    //标题打字特效
    onMounted(async () => {
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
    });

    //点击箭头
    function toBottom() {
        window.scrollTo({
            top: window.innerHeight * 0.72
        });
    }
</script>

<template>
    <div class="home-jumbotron">
        <div class="jumbo-background" :style="style.background"></div>
        <div class="jumbo-banner" :style="style.title">
            <h1 class="jumbo-title" :class="{ [`main-typing`]: title.isMainTyping }">{{ title.main }}</h1>
            <h2 class="jumbo-phrase" :class="{ [`sub-typing`]: title.isSubTyping }">{{ title.sub }}</h2>
        </div>
        <a class="jumbo-hide" @click="toBottom">
            <fa-icon icon="chevron-down"/>
        </a>
    </div>
</template>

<style lang="scss" scoped>
    .home-jumbotron {
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
        text-align: center;
        text-shadow: 0 0 12px rgb(0 0 0 / 66%);
        color: white;

        > * {
            font-family: "Noto Serif JP";
        }
    }

    .jumbo-title {
        margin-bottom: 16px;
        font-size: 72px;
        line-height: 1em;
    }

    .jumbo-phrase {
        height: 1.4em;
    }

    .main-typing::after, .sub-typing::after {
        content: "";
        display: inline-block;
        height: 1em;
        outline: 1px solid white;
        vertical-align: middle;
        animation: cursor-flash 1s forwards infinite;
        translate: 4px -0.12em;
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
        font-size: 64px;
        color: white;
        transition: all 0.4s;

        &:hover {
            opacity: 1;
        }

        > svg {
            opacity: 0.5;
            margin: auto;
        }
    }
</style>