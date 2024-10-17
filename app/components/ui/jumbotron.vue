<script lang="ts" setup>
    const config = useRuntimeConfig();

    const duration = 400;
    const titleDelay = 80;
    const summaryDelay = 20;
    const { title, summary } = config.public.jumbotron;
    const titleChars = [...title];
    const summaryChars = ref([]);
    const [isMotion, toggleMotion] = useToggle(true);

    //标题动效
    Zin.delay(duration + titleDelay).then(async () => {
        await Zin.interval((i) => {
            const char = summary[i];
            summaryChars.value.push(char);
        }, {
            duration: summaryDelay,
            times: summary.length
        });
        await Zin.delay(duration);
        toggleMotion(false);
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
        <nuxt-img class="jumbo-image" src="/garden/jumbotron.webp" alt="[jumbotron]"/>
        <div class="jumbo-banner">
            <h1 class="jumbo-title">
                <template v-if="isMotion">
                    <span v-for="(char, i) in titleChars" class="jumbo-char" :style="{ animationDelay: `${i * titleDelay}ms` }">{{ char }}</span>
                </template>
                <template v-else>{{ title }}</template>
            </h1>
            <h2 class="jumbo-phrase">
                <template v-if="isMotion">
                    <span v-for="char in summaryChars" class="jumbo-char">{{ char }}</span>
                </template>
                <template v-else>{{ summary }}</template>
            </h2>
        </div>
        <a class="jumbo-hide" @click="toBottom">
            <iconify name="fa6-solid:chevron-down"/>
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
        animation-range: exit;
        animation-timeline: view();
    }

    @keyframes jumbo-parallax {
        to {
            translate: 0 calc($h / 2);
        }
    }

    .jumbo-title, .jumbo-phrase {
        height: 1em;
    }

    .jumbo-title {
        font-size: 72px;

        > .jumbo-char {
            &:nth-child(2n) {
                animation-name: jumbo-char-cross-up;
            }

            &:nth-child(2n + 1) {
                animation-name: jumbo-char-cross-down;
            }
        }
    }

    .jumbo-phrase {
        margin-block: 32px 8px;

        > .jumbo-char {
            animation-name: jumbo-char-jump;
        }
    }

    .jumbo-char {
        display: inline-block;
        opacity: 0;
        animation: 0.4s ease-out both;
    }

    @keyframes jumbo-char-cross-up {
        from {
            translate: 0 50%;
        }

        to {
            opacity: 1;
            translate: 0;
        }
    }

    @keyframes jumbo-char-cross-down {
        from {
            translate: 0 -50%;
        }

        to {
            opacity: 1;
            translate: 0;
        }
    }

    @keyframes jumbo-char-jump {
        0% {
            translate: 0 133%;
        }

        50% {
            translate: 0 -33%;
        }

        75% {
            translate: 0 16.7%;
        }

        100% {
            opacity: 1;
            translate: 0;
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

        > .iconify {
            margin: auto;
        }
    }
</style>