<script lang="ts" setup>
    import type { Article } from "~/utils/Article";

    defineProps<{
        art: Article;
    }>();
</script>

<template>
    <nuxt-link class="content-widget tabular-item" :to="art.route">
        <div class="tabular-background">
            <nuxt-img v-if="art.cover" class="tabular-cover" :src="art.cover"/>
        </div>
        <div class="tabular-wrapper">
            <h2 class="content-h2 tabular-title">
                <icon v-if="art.sticky < Infinity" name="pepicons-print:pin"/>
                {{ art.title }}
            </h2>
            <ul class="tabular-info">
                <li>
                    <icon name="fa6-solid:book-open"/>
                    <span>{{ art.volumeInfo.title }}</span>
                </li>
                <li>
                    <icon name="nonicons:keyword-16"/>
                    <span>{{ art.wordCount }} 字</span>
                </li>
                <li>
                    <icon name="fa6-solid:pen"/>
                    <time>{{ art.publishDate }}</time>
                </li>
                <li>
                    <icon name="fa6-solid:clock-rotate-left"/>
                    <time>{{ art.updateDate }}</time>
                </li>
            </ul>
            <p class="p-small">
                <template v-if="art.excerpt">{{ art.excerpt }}</template>
                <span v-else class="text-gray">这篇文章还没有简介。</span>
            </p>
        </div>
        <span class="tabular-thumb"></span>
    </nuxt-link>
</template>

<style lang="scss" scoped>
    .tabular-item {
        --origin: left;

        display: flex;
        flex-direction: var(--direction);
        border-block: none;
        perspective: 1024px;
        perspective-origin: var(--origin);
        transition: all 0.25s;

        &:nth-of-type(2n) {
            --direction: row-reverse;
            --origin: right;
            --margin: -6% 8px;
            --rotate: -18deg;
        }

        &:hover {
            background-color: var(--color-background);
        }

        @include viewport("sm") {
            flex-direction: column;
        }
    }

    .tabular-background {
        display: grid;
        flex: 0.75;
        position: relative;
        overflow: hidden;
        height: 160px;
        margin: 8px;
        border-radius: 8px;
        transform-origin: var(--origin);
        transition: all 0.25s;

        @include viewport(">sm") {
            :hover > & {
                margin-inline: var(--margin, 8px -6%);
                rotate: y var(--rotate, 18deg);
            }
        }

        @include viewport("sm") {
            flex: none;
        }

        &::before {
            content: "Cover.";
            display: grid;
            place-items: center;
            position: absolute;
            opacity: 0.33;
            inset: 0;
            background-color: var(--color-info-light-5);
            font-size: 48px;
            font-weight: bold;
        }
    }

    .tabular-cover {
        position: absolute;
        height: 100%;
        object-fit: cover;
    }

    .tabular-wrapper {
        display: grid;
        flex: 1;
        align-content: center;
        gap: 4px;
        position: relative;
        padding: 16px;
        text-align: center;

        @include viewport("sm") {
            padding-top: 0;
        }
    }

    .tabular-title {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2px;
        line-height: 32px;

        > .iconify {
            font-size: 24px;
            color: var(--color-theme-text);
        }
    }

    .tabular-info {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        column-gap: 18px;
        font-size: 12px;
        line-height: 20px;
        color: var(--color-text-info);

        > li {
            display: flex;
            align-items: center;
            gap: 4px;
        }
    }

    .tabular-thumb {
        width: 4px;
        height: 80px;
        margin: auto 8px;
        border-radius: var(--bounded-full);
        background-color: var(--color-theme-dark);

        @include viewport("sm") {
            display: none;
        }
    }
</style>