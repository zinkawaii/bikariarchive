<script setup>
    const links = [
        {
            title: "日文名发生装置",
            href: "/tools/namaemaker"
        },
        {
            title: "歌词打轴",
            href: "/tools/lyricaxis"
        },
        {
            title: "西北风计算器",
            href: "/tools/excalc"
        },
        {},
        {}
    ];
</script>

<template>
    <div class="home-tool-container">
        <nuxt-link v-for="link in links" class="home-tool" :to="link.href">
            <span>{{ link.title || "卖萌中……" }}</span>
            <fa icon="arrow-right"/>
        </nuxt-link>
    </div>
</template>

<style lang="scss" scoped>
    .home-tool-container {
        display: grid;
        grid: auto / repeat(auto-fit, minmax(144px, 1fr));
        grid-gap: 16px;
    }

    .home-tool {
        $shadow: 1px 1px 4px black;

        position: relative;
        height: 64px;
        border-radius: 8px;
        box-shadow: var(--box-shadow);
        background-position: center;
        background-size: cover;
        font-family: var(--font-smooth);
        word-break: keep-all;
        text-shadow: $shadow;
        color: white;

        span {
            display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            transition: all 0.4s;
            translate: -50% -50%;

            &::before {
                content: "";
                display: block;
                position: absolute;
                top: 8px;
                left: -8px;
                width: 0;
                height: 16px;
                background-color: rgb(0 0 0 / 25%);
                transition: all 0.4s;
                z-index: -1;
            }
        }

        svg {
            position: absolute;
            opacity: 0;
            right: 8px;
            bottom: 4px;
            font-size: 24px;
            transition: all 0.4s;
            filter: drop-shadow($shadow);
        }

        &:hover {
            span {
                top: 8px;
                left: 8px;
                translate: 0;

                &::before {
                    width: calc(100% + 16px);
                }
            }

            svg {
                opacity: 0.8;
            }
        }

        @for $i from 1 through 5 {
            &:nth-child(#{$i}) {
                background-image: url("/garden/background/tool_#{$i}.png");
            }
        }
    }
</style>