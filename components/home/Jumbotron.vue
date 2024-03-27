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
        const config = useRuntimeConfig();
        const { main, sub } = config.public.jumbotron;

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
        <nuxt-img class="jumbo-image" src="/garden/jumbotron.webp" :style="style.background"/>
        <div class="jumbo-banner" :style="style.title">
            <h1 class="jumbo-title" :class="{ [`main-typing`]: title.isMainTyping }">{{ title.main }}</h1>
            <h2 class="jumbo-phrase" :class="{ [`sub-typing`]: title.isSubTyping }">{{ title.sub }}</h2>
        </div>
        <a class="jumbo-hide" @click="toBottom">
            <fa icon="chevron-down"/>
        </a>
    </div>
</template>

<style lang="scss" scoped>
    .home-jumbotron {
        position: relative;
        overflow: hidden;
    }

    .jumbo-image {
        height: 72vh;
        object-fit: cover;
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
            height: 1em;
        }
    }

    .jumbo-title {
        font-size: 72px;
    }

    .jumbo-phrase {
        margin-block: 32px 8px;
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
        inset: 80% 0 0;
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