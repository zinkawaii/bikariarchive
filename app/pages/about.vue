<script lang="ts" setup>
    import dayjs from "dayjs";

    useHead({
        title: "关于"
    });

    const today = dayjs();
    const year = today.year();

    const birth = "09-29";
    const isBefore = today.isBefore(`${year}-${birth}`);
    const birthday = dayjs(`${year - (isBefore ? 1 : 0)}-${birth}`);

    const level = year - 2003 + (isBefore ? 0 : 1);
    const total = today.isLeapYear() && isBefore ? 366 : 365;
    const exp = today.diff(birthday, "day");
</script>

<template>
    <div class="azur-wrapper">
        <div class="azur-cover"></div>
        <div class="azur-fixed"></div>
        <div class="azur-header">
            <div class="azur-header-corner"></div>
            <nuxt-link class="azur-header-return" :to="{ name: `home` }">
                <div class="azur-header-arrow"><i></i></div>
            </nuxt-link>
            <div class="azur-header-nabla"></div>
            <div class="azur-header-title">
                <div class="azur-header-text">
                    <span reset>个人信息</span>
                    <span reset>DATA</span>
                </div>
            </div>
        </div>
        <div class="azur-body">
            <div class="azur-body-top">
                <div class="azur-operator"></div>
                <div class="azur-block azur-resume">
                    <div class="azur-block-title">
                        <span reset>履历</span>
                        <span reset>RESUME</span>
                    </div>
                    <div class="azur-block-wrapper">
                        <div class="azur-block-content">
                            <div class="azur-resume-part">
                                <span class="azur-author" reset>{{ $config.public.author }}</span>
                                <div class="azur-uid" reset>
                                    <span>UID:</span>
                                    <span>37810541</span>
                                </div>
                            </div>
                            <div class="azur-resume-part" reset>
                                <div class="azur-level">
                                    <span>LV.</span>
                                    <span>{{ level }}</span>
                                </div>
                                <span>{{ exp }}/{{ total }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="azur-cross"></div>
                <div class="azur-center"></div>
            </div>
            <div class="azur-body-bottom">
                <div class="azur-center">
                    <div class="azur-float" reset>
                        <div class="azur-appella">
                            <iconify name="emojione-monotone:bed"/>
                            <ruby>蹲家<rt>HIKIKOMORI</rt></ruby>
                        </div>
                        <div class="azur-rank">
                            <span>最高头衔: 群主</span>
                        </div>
                        <div class="azur-entry">
                            <span>经济实力:</span>
                            <span class="azur-entry-highlight">0</span>
                        </div>
                        <div class="azur-entry">
                            <span>挂科率:</span>
                            <span>100%</span>
                        </div>
                    </div>
                </div>
                <div class="azur-block azur-data">
                    <div class="azur-block-title">
                        <span reset>数据</span>
                        <span reset>NOVEL DATA</span>
                    </div>
                    <div class="azur-block-wrapper">
                    </div>
                </div>
                <div class="azur-block azur-signature">
                    <div class="azur-block-title">
                        <span reset>签名</span>
                        <span reset>SIGNATURE</span>
                    </div>
                    <div class="azur-block-wrapper">
                        <div class="azur-block-content">
                            <p reset>有些人只拥吻影子，于是只拥有幸福的幻影</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .azur-wrapper {
        --azur-blue-1: rgb(97 153 245);
        --azur-blue-2: rgb(132 230 255);
        --azur-blue-3: rgb(197 219 255);
        --azur-blue-2-alpha: rgb(194 243 255 / 75%);
        --azur-darkblue-1: rgb(33 36 45);
        --azur-darkblue-2: rgb(33 28 60);
        --azur-darkblue-3: rgb(45 45 88);
        --azur-gray-1: rgb(120 120 120 / 75%);
        --azur-text-black: rgb(0 0 24);
        --azur-text-gray: rgb(255 255 255 / 66%);
        --azur-text-white: rgb(255 255 255);
        --azur-full-height: calc(100dvh - 64px);

        container-type: size;
        overflow: hidden;
        height: var(--azur-full-height);
        color: var(--azur-text-white);
    }

    .azur-cover {
        position: fixed;
        inset: 0;
        background-image: url("/garden/maestrale/cover.webp");
        background-position: center;
        background-size: cover;
        scale: -1 1;
    }

    .azur-fixed {
        position: fixed;
        inset: 0;
        height: 65px;
        border-bottom: 2px solid var(--azur-gray-1);
        background-color: var(--azur-darkblue-1);
        mask-image: linear-gradient(to right, rgb(0 0 0 / 75%), transparent 75%);
    }

    .azur-header {
        position: absolute;
        animation: azur-slide-down 0.4s backwards;
        z-index: 1;
    }

    @keyframes azur-slide-down {
        from {
            translate: 0 -100%;
        }
    }

    .azur-header-corner {
        position: absolute;
        top: 62px;
        left: 1px;
        width: 62px * sqrt(2);
        height: 1px;
        background-color: var(--azur-gray-1);
        transform-origin: left;
        rotate: -45deg;
    }

    .azur-header-return {
        $w: 62px * sqrt(2);
        $t: 64px - calc(62px / sqrt(2));

        display: grid;
        place-content: center;
        width: $w;
        aspect-ratio: 1;
        padding: 3px;
        border: 2px solid var(--azur-blue-1);
        background-clip: content-box;
        background-color: rgb(35 31 48);
        rotate: -45deg;
        translate: ($t + 3px) $t;

        &::before, &::after {
            content: "";
            position: absolute;
            width: 5px;
            aspect-ratio: 1;
            background-color: var(--azur-text-white);
        }

        &::before {
            top: -10px;
            left: -2px;
        }

        &::after {
            right: -2px;
            bottom: -10px;
        }
    }

    .azur-header-arrow {
        display: flex;
        filter: drop-shadow(0 0 8px var(--azur-blue-1));

        > i {
            width: 45px;
            aspect-ratio: 1;
            background-color: var(--azur-text-white);
            clip-path:
                polygon(
                    0 0,
                    100% 0,
                    calc(100% - 2px) 3px,
                    5px 3px,
                    100% calc(100% - 2px),
                    100% 100%,
                    calc(100% - 2px) 100%,
                    3px 5px,
                    3px calc(100% - 2px),
                    0 100%
                );
        }
    }

    .azur-header-nabla {
        $w: calc(50px / sqrt(2));

        position: absolute;
        top: calc(-1 * $w / 2);
        left: $w * 2 + 11px;
        width: $w;
        aspect-ratio: 1;
        border: 4px solid var(--azur-blue-1);
        outline: 1px solid var(--azur-gray-1);
        outline-offset: 3px;
        rotate: 45deg;
    }

    .azur-header-title {
        $h: 44px;
        $hh: calc($h / 2);
        $pr: 7px;

        display: flex;
        align-items: center;
        position: absolute;
        top: 10px;
        left: 112px;
        height: $h;
        padding-inline: $hh $pr;
        background: linear-gradient(to right, rgb(35 31 45), transparent);
        clip-path:
            polygon(
                $hh 0,
                100% 0,
                100% 100%,
                $hh 100%,
                0 $hh
            );

        &::before {
            content: "";
            position: absolute;
            inset: 50% 0 2px 4px;
            background-color: var(--azur-blue-1);
            clip-path:
                polygon(
                    0 0,
                    2px 0,
                    22px calc(100% - 1px),
                    calc(100% - $pr) calc(100% - 1px),
                    calc(100% - $pr) 100%,
                    21px 100%
                );
        }

        &::after {
            content: "";
            position: absolute;
            right: 0;
            bottom: 2px;
            width: $pr - 2px;
            height: 5px;
            background-image:
                linear-gradient(
                    var(--azur-blue-1) 1px,
                    transparent 1px,
                    transparent 2px,
                    var(--azur-blue-1) 2px
                );
        }
    }

    .azur-header-text {
        display: flex;
        align-items: flex-end;
        gap: 8px;
        width: 256px;
        padding: 4px 0 1px 6px;
        border-bottom: 3px solid rgb(0 0 0 / 25%);
        line-height: 1;

        > :first-child {
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 1px;
            text-shadow: 0 0 16px var(--azur-blue-1);
            color: var(--azur-text-white);
        }

        > :last-child {
            font-size: 9px;
            letter-spacing: 3px;
            color: var(--azur-text-gray);
        }
    }

    .azur-body {
        position: fixed;
        inset: 0 0 0 max(0px, calc(100vw - 87.5cqh));
    }

    :where(.azur-body-top, .azur-body-bottom) {
        display: flex;
        flex-direction: column;
        gap: 4%;
        height: 50%;
        padding-left: 32px;

        &::before {
            content: "";
            position: absolute;
            inset: 0;
            border-left: 4px solid var(--azur-gray-1);
            background-color: var(--azur-darkblue-2);
            mask-image: linear-gradient(to right, rgb(0 0 0 / 25%), black);
        }

        &::after {
            content: "";
            position: absolute;
            left: 14px;
            width: 4px;
            height: 35%;
            background-color: var(--azur-blue-2-alpha);
        }
    }

    .azur-body-top {
        transform: skewX(30deg);
        transform-origin: top;

        &::after {
            bottom: 0;
            border-radius: 2px 2px 0 0;
        }

        [reset] {
            transform: skewX(-30deg);
            transform-origin: bottom;
        }
    }

    .azur-body-bottom {
        justify-content: flex-end;
        transform: skewX(-30deg);
        transform-origin: bottom;

        &::after {
            top: 0;
            border-radius: 0 0 2px 2px;
        }

        [reset] {
            transform: skewX(30deg);
            transform-origin: top;
        }
    }

    .azur-operator {
        height: 27%;
    }

    .azur-block, .azur-center {
        animation: azur-slide-in 0.4s backwards;
    }

    @keyframes azur-slide-in {
        from {
            translate: 100% 0;
        }
    }

    .azur-block {
        display: grid;
        grid-template-rows: auto 1fr;
    }

    .azur-block-title {
        display: flex;
        align-items: flex-end;
        gap: 4px;
        position: relative;
        width: fit-content;
        height: 22px;
        min-width: 112px;
        padding-inline: 6px 14px;
        font-weight: bold;
        color: var(--azur-text-black);

        &::before {
            content: "";
            position: absolute;
            inset: 0;
            background-color: var(--azur-blue-2);
        }

        &::after {
            content: "";
            position: absolute;
            right: -19px;
            width: 13px;
            height: inherit;
            background-color: var(--azur-blue-2);
        }

        > :last-child {
            font-size: 8px;
            letter-spacing: 1px;
        }

        .azur-body-bottom & {
            $w: 26px;

            gap: 10px;
            padding-right: 21px;

            &::before {
                clip-path:
                    polygon(
                        0 0,
                        calc(100% - $w) 0,
                        100% 100%,
                        0 100%
                    );
            }

            &::after {
                width: 39px;
                clip-path:
                    polygon(
                        0 0,
                        calc(100% - $w) 0,
                        100% 100%,
                        $w 100%
                    );
            }
        }
    }

    .azur-block-wrapper {
        container-type: size;
        text-wrap: nowrap;

        &::before {
            content: "";
            position: absolute;
            opacity: 0.5;
            inset: 0;
            border-top: 2px solid var(--azur-gray-1);
            background-color: var(--azur-darkblue-2);
        }
    }

    .azur-block-content {
        height: 100%;
        padding: 14px 0 0 26px;
    }

    .azur-resume {
        height: 29.5%;

        .azur-block-content {
            display: flex;
            justify-content: space-between;
            max-width: calc(0.638 * var(--azur-full-height) - 32px);
            padding: 0 0 0 12cqh;
        }
    }

    .azur-resume-part {
        display: grid;
        align-content: center;
        font-family: var(--font-smooth);
        font-size: 25cqh;
        line-height: 37cqh;

        &:last-child {
            justify-items: flex-end;
        }
    }

    .azur-author {
        letter-spacing: 1px;
    }

    .azur-uid, .azur-level {
        display: flex;
        gap: 0.25em;

        > :first-child {
            color: var(--azur-text-gray);
        }
    }

    .azur-level {
        font-size: 32cqh;

        > :first-child {
            letter-spacing: -5cqh;
        }
    }

    .azur-cross {
        height: 6%;
    }

    .azur-center {
        container-type: size;
        flex: 1;
        margin-left: -32px;
        animation-delay: 0.1s;

        &::before {
            content: "";
            position: absolute;
            inset: 0;
            background-color: var(--azur-darkblue-3);
            mask-image: linear-gradient(to right, transparent, white);
        }
    }

    .azur-float {
        display: grid;
        grid-template:
            "A B" 1fr
            "A C" auto
            "A D" auto / auto 1fr;
        justify-items: flex-end;
        position: absolute;
        bottom: 0;
        width: 322cqh;
        height: 218cqh;
        margin: 0 0 6cqh -32cqh;
        font-family: var(--font-smooth);
    }

    .azur-appella {
        display: grid;
        grid-area: A;
        justify-items: center;
        width: fit-content;
        padding-top: 6cqh;

        > .iconify {
            font-size: 152cqh;
            filter: drop-shadow(0 0 24cqh var(--azur-darkblue-3));
        }

        > ruby {
            font-size: 42cqh;

            > rt {
                font-family: var(--font-code);
                font-size: 12cqh;
                letter-spacing: 1px;
                color: var(--azur-text-gray);
                translate: 0 -3cqh;
            }
        }
    }

    .azur-rank {
        font-size: 18cqh;
        color: var(--azur-blue-3);
    }

    .azur-entry {
        display: grid;
        width: 120cqh;
        margin-block: 6cqh;

        > :first-child {
            font-size: 18cqh;
        }

        > :last-child {
            font-size: 42cqh;
            text-align: right;
        }
    }

    .azur-entry-highlight {
        color: rgb(255 250 158);
    }

    .azur-data {
        height: 37%;
        animation-delay: 0.2s;
    }

    .azur-signature {
        height: 26%;
        animation-delay: 0.3s;
    }
</style>