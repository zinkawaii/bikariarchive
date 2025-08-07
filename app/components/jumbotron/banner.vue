<script lang="ts" setup>
    const config = useRuntimeConfig();

    const duration = 400;
    const titleDelay = 80;
    const summaryDelay = 20;
    const { title, summary } = config.public.jumbotron;
    const titleChars = [...title];
    const summaryChars = ref<string[]>([]);
    const [isMotion, toggleMotion] = useToggle(true);

    //标题动效
    Zin.delay(duration + titleDelay).then(async () => {
        await Zin.interval((i) => {
            const char = summary[i];
            summaryChars.value.push(char);
        }, {
            duration: summaryDelay,
            times: summary.length,
        });
        await Zin.delay(duration);
        toggleMotion(false);
    });
</script>

<template>
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
</template>

<style lang="scss" scoped>
    $h: 72svh;

    .jumbo-banner {
        display: grid;
        align-content: center;
        position: absolute;
        inset: 0 0 calc(100svh - var(--jumbotron-percent) * $h);
        text-align: center;
        text-shadow: 0 0 12px rgb(0 0 0 / 66%);
        color: white;
        animation: jumbo-parallax linear;
        animation-range: exit;
        animation-timeline: view();
    }

    @keyframes jumbo-parallax {
        to {
            translate: 0 calc(var(--jumbotron-percent) * $h / 2);
        }
    }

    .jumbo-title, .jumbo-phrase {
        height: 1.25em;
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
        margin-top: 0.25em;
        line-height: 1.25;

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
</style>
