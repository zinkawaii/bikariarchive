<script lang="ts" setup>
    const config = useRuntimeConfig();

    const duration = 400;
    const titleDelay = 80;
    const summaryDelay = 20;
    const { title, subtitle } = config.public;
    const titleChars = [...title];
    const subtitleChars = ref<string[]>([]);
    const [isMotion, toggleMotion] = useToggle(true);

    //标题动效
    onMounted(async () => {
        await Zin.delay(duration + titleDelay);
        await Zin.interval((i) => {
            const char = subtitle[i];
            subtitleChars.value.push(char);
        }, {
            duration: summaryDelay,
            times: subtitle.length,
        });
        await Zin.delay(duration);
        toggleMotion(false);
    });
</script>

<template>
    <div class="jumbotron-banner">
        <h1 class="jumbotron-title">
            <template v-if="isMotion">
                <span
                    v-for="(char, i) in titleChars"
                    class="jumbotron-char"
                    :style="{ animationDelay: `${i * titleDelay}ms` }"
                >{{ char }}</span>
            </template>
            <template v-else>{{ title }}</template>
        </h1>
        <h2 class="jumbotron-subtitle">
            <template v-if="isMotion">
                <span v-for="char in subtitleChars" class="jumbotron-char">{{ char }}</span>
            </template>
            <template v-else>{{ subtitle }}</template>
        </h2>
    </div>
</template>

<style lang="scss" scoped>
    .jumbotron-banner {
        display: grid;
        align-content: center;
        position: absolute;
        inset: 0;
        text-align: center;
        text-shadow: 0 0 12px rgb(0 0 0 / 66%);
        color: white;
        animation: jumbo-parallax linear;
        animation-range: exit;
        animation-timeline: view();
    }

    @keyframes jumbo-parallax {
        from {
            translate: 0 calc(36svh * (var(--jumbotron-percent) - 1));
        }

        to {
            translate: 0 36svh;
        }
    }

    .jumbotron-title {
        font-size: 72px;

        > .jumbotron-char {
            &:nth-child(2n) {
                animation-name: jumbo-char-cross-up;
            }

            &:nth-child(2n + 1) {
                animation-name: jumbo-char-cross-down;
            }
        }
    }

    .jumbotron-subtitle {
        height: 1lh;
        margin-bottom: 0.5em;

        > .jumbotron-char {
            animation-name: jumbo-char-jump;
        }
    }

    .jumbotron-char {
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
