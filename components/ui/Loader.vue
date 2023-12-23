<script setup>
    const loading = ref(true);

    nextTick(() => {
        loading.value = false;
    });
</script>

<template>
    <Transition name="fade">
        <div v-if="loading" class="z-loader">
            <div class="loader-graph"></div>
            <div class="loader-shadow"></div>
        </div>
    </Transition>
</template>

<style lang="scss" scoped>
    $loader-color: rgb(255 245 165);

    .z-loader {
        position: fixed;
        inset: 0;
        background: linear-gradient(135deg, rgb(153 210 228), rgb(255 212 218));
    }

    .fade-leave-active {
        transition: opacity 0.2s ease;
    }

    .fade-leave-to {
        opacity: 0;
    }

    .loader-graph {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 50px;
        height: 50px;
        margin: -25px 0 0 -25px;
        background-color: $loader-color;
        animation: loader-main 2.6s ease 0s infinite forwards;
        z-index: 2;

        &::after {
            content: "";
            display: inline-block;
            position: absolute;
            top: 0;
            left: -50px;
            width: 50px;
            height: 50px;
            background-color: $loader-color;
            transform-origin: top right;
            animation: loader-secundary 2.6s ease 0s infinite forwards;
        }
    }

    .loader-shadow {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100px;
        height: 10px;
        margin: 50px 0 0 -75px;
        border-radius: 50%;
        background-color: rgb(149 165 166);
        animation:
            loader-shadow 2.6s ease 0s infinite forwards,
            loader-float 5s ease-in-out 0s infinite forwards;
        z-index: 1;
        filter: blur(5px);
    }

    @keyframes loader-main {
        0% {
            width: 50px;
            rotate: 0deg;
            translate: 0;
        }

        20% {
            width: 50px;
            rotate: 0deg;
            translate: 0;
        }

        40% {
            width: 150px;
            rotate: 0deg;
            translate: -50px;
        }

        60% {
            width: 150px;
            transform-origin: bottom right;
            rotate: 90deg;
            translate: -150px;
        }

        80% {
            width: 50px;
            rotate: 90deg;
            translate: -25px;
        }

        100% {
            width: 50px;
            rotate: 90deg;
            translate: -50px;
        }
    }

    @keyframes loader-secundary {
        0% {
            rotate: 0deg;
        }

        20% {
            rotate: 180deg;
        }

        40% {
            rotate: 180deg;
        }

        60% {
            rotate: 0deg;
        }

        80% {
            rotate: 0deg;
        }

        100% {
            rotate: 180deg;
        }
    }

    @keyframes loader-shadow {
        0% {
            width: 150px;
            translate: -25px;
        }

        20% {
            width: 75px;
            translate: 37.5px;
        }

        40% {
            width: 200px;
            translate: -25px;
        }

        60% {
            width: 75px;
            translate: 37.5px;
        }

        80% {
            width: 75px;
            translate: 37.5px;
        }

        100% {
            width: 150px;
            translate: -25px;
        }
    }

    @keyframes loader-float {
        0% {
            top: 50%;
        }

        50% {
            top: 51%;
        }

        100% {
            top: 50%;
        }
    }
</style>