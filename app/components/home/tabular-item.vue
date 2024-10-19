<script lang="ts" setup>
    import type { Article } from "~/utils/article";

    defineProps<{
        art: Article;
    }>();
</script>

<template>
    <nuxt-link class="content-widget tabular-item" :to="art.route">
        <novel-cover class="tabular-cover" v-bind="art.cover"/>
        <div class="tabular-wrapper">
            <h2 class="content-h2 tabular-title">
                <iconify v-if="art.sticky < Infinity" name="pepicons-print:pin"/>
                {{ art.title }}
            </h2>
            <ul class="tabular-info">
                <li>
                    <iconify name="fa6-solid:book-open"/>
                    <span>{{ art.volumeInfo.title }}</span>
                </li>
                <li>
                    <iconify name="nonicons:keyword-16"/>
                    <span>{{ art.wordCount }} 字</span>
                </li>
                <li>
                    <iconify name="fa6-solid:pen"/>
                    <time>{{ art.publishDate }}</time>
                </li>
                <li>
                    <iconify name="fa6-solid:clock-rotate-left"/>
                    <time>{{ art.updateDate }}</time>
                </li>
            </ul>
            <novel-article v-if="art.excerpt" class="p-small text-secondary" tag="p" :body="art.excerpt"/>
            <p v-else class="p-small text-gray">这篇文章还没有简介。</p>
        </div>
        <span class="tabular-thumb"></span>
    </nuxt-link>
</template>

<style lang="scss" scoped>
    .tabular-item {
        display: flex;
        flex-direction: var(--direction);
        border-block: none;
        transition: all 0.25s;

        &:nth-of-type(2n) {
            --direction: row-reverse;
        }

        &:hover {
            background-color: var(--color-background);
            translate: 0 -4px;
        }

        @include viewport("sm") {
            flex-direction: column;
        }
    }

    .tabular-cover {
        flex: 0.75;
        height: 160px;
        margin: 8px;
        border-radius: 8px;
        transition: all 0.25s;

        @include viewport("sm") {
            flex: none;
        }
    }

    .tabular-wrapper {
        display: grid;
        flex: 1;
        align-content: center;
        gap: 4px;
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