<script setup>
    const title = ref({
        main: "",
        sub: "",
        isMainTyping: false,
        isSubTyping: false
    });

    //标题打字特效
    onMounted(async () => {
        const config = useRuntimeConfig();
        const { main, sub } = config.public.jumbotron;

        //主标题
        title.value.isMainTyping = true;
        await Zin.setInterval((t) => {
            title.value.main = main.slice(0, t);
        }, {
            duration: 125,
            times: main.length + 1
        });
        title.value.isMainTyping = false;

        //副标题
        title.value.isSubTyping = true;
        await Zin.setInterval((t) => {
            title.value.sub = sub.slice(0, t);
        }, {
            duration: 100,
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
        <nuxt-img class="jumbo-image" src="/garden/jumbotron.webp"/>
        <div class="jumbo-banner">
            <h1 class="jumbo-title" :class="{ [`main-typing`]: title.isMainTyping }">{{ title.main }}</h1>
            <h2 class="jumbo-phrase" :class="{ [`sub-typing`]: title.isSubTyping }">{{ title.sub }}</h2>
        </div>
        <a class="jumbo-hide" @click="toBottom">
            <icon name="fa6-solid:chevron-down"/>
        </a>
    </div>
</template>

<style lang="scss" scoped>
    $h: 72vh;

    .home-jumbotron {
        height: $h * 2;
        margin-bottom: -$h;
        clip-path: inset(0 0 50% 0);
    }

    .jumbo-image {
        position: sticky;
        top: 0;
        height: 50%;
        object-fit: cover;
    }

    .jumbo-banner {
        display: grid;
        align-content: center;
        position: absolute;
        inset: 0 0 (100vh - $h);
        text-align: center;
        text-shadow: 0 0 12px rgb(0 0 0 / 66%);
        color: white;
        animation: jumbo-parallax linear;
        animation-timeline: view();
        animation-range: exit;

        > * {
            height: 1em;
        }
    }

    @keyframes jumbo-parallax {
        to {
            translate: 0 calc($h / 2);
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
        inset: ($h - 14vh) 0 (100vh - $h);
        background: linear-gradient(transparent, black);
        font-size: 64px;
        color: white;
        transition: all 0.4s;

        &:hover {
            opacity: 0.5;
        }

        > svg {
            margin: auto;
        }
    }
</style>