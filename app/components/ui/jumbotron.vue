<script lang="ts" setup>
    const percent = ref(1);

    useAdoptedStyleSheet/* CSS */`
        .z-jumbotron {
            --jumbotron-percent: ${percent};
        }
    `;

    function onBeforeEnter() {
        percent.value = 1;
    }

    function onBeforeLeave() {
        const { scrollY, innerHeight } = window;
        const marginTop = innerHeight * 0.72 - scrollY;
        percent.value = marginTop > 0 ? Math.min(1, marginTop / (innerHeight * 0.72)) : 0;

        if (percent.value) {
            window.scrollTo({
                top: 0,
                behavior: "instant",
            });
        }
    }

    //点击箭头
    function toBottom() {
        window.scrollTo({
            top: window.innerHeight * 0.72,
        });
    }
</script>

<template>
    <transition @before-enter="onBeforeEnter" @before-leave="onBeforeLeave">
        <div v-if="$route.meta.jumbotron" class="z-jumbotron">
            <nuxt-img
                class="jumbotron-image"
                src="/garden/jumbotron.webp"
                alt="[jumbotron]"
                provider="cdn"
                fetchpriority="high"
            />
            <jumbotron-banner />
            <button class="jumbotron-skip" aria-label="跳转到主要内容" @click="toBottom">
                <iconify name="fa7-solid:chevron-down"/>
            </button>
        </div>
    </transition>
</template>

<style lang="scss" scoped>
    @property --jumbotron-percent {
        syntax: "<number>";
        inherits: true;
        initial-value: 1;
    }

    $h: 72svh;

    .z-jumbotron {
        position: relative;
        height: $h;
        margin-bottom: calc($h * (var(--jumbotron-percent) - 1));
        mask-image: linear-gradient(black calc(100% * var(--jumbotron-percent)), transparent 0);

        &:where(.v-enter-active, .v-leave-active) {
            transition: --jumbotron-percent 0.4s;
        }

        &:where(.v-enter-from, .v-leave-to) {
            --jumbotron-percent: 0;
        }
    }

    .jumbotron-image {
        display: block;
        position: sticky;
        top: 0;
        height: 100%;
        margin-bottom: -100%;
        object-fit: cover;
    }

    .jumbotron-skip {
        display: flex;
        position: absolute;
        opacity: 0;
        inset: calc(100% - 14svh) 0 0;
        background-image: linear-gradient(transparent, black);
        font-size: 64px;
        color: white;
        transition: opacity 0.4s;

        &:hover {
            opacity: 0.5;
        }

        > .iconify {
            margin: auto;
        }
    }
</style>
