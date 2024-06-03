<script lang="ts" setup>
    import type { Article } from "~/utils/Article";

    defineProps<{
        art: Article;
    }>();
</script>

<template>
    <nuxt-link class="content-widget home-article-item" :to="art.route">
        <div class="home-article-background">
            <nuxt-img v-if="art.cover" class="home-article-cover" :src="art.cover"/>
        </div>
        <div class="home-article-wrapper">
            <h2 class="content-h2 home-article-title">{{ art.title }}</h2>
            <ul class="home-article-info">
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
        <span class="home-article-thumb"></span>
    </nuxt-link>
</template>

<style lang="scss" scoped>
    .home-article-item {
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

    .home-article-background {
        display: grid;
        flex: 0.75;
        align-content: center;
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

    .home-article-cover {
        position: relative;
    }

    .home-article-wrapper {
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

    .home-article-title {
        line-height: 32px;
    }

    .home-article-info {
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

    .home-article-thumb {
        width: 4px;
        height: 80px;
        margin: auto 8px;
        border-radius: var(--circle-radius);
        background-color: var(--color-theme-dark);

        @include viewport("sm") {
            display: none;
        }
    }
</style>