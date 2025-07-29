<script lang="ts" setup>
    import type { Article } from "~/utils/article";
    import type { GetArticleResponse } from "~~/server/types/api/article";

    defineProps<{
        art: Article;
        post?: GetArticleResponse;
    }>();
</script>

<template>
    <novel-cover v-if="art.cover" v-bind="art.cover" viewable/>
    <header class="novel-header">
        <h1 class="novel-title">{{ art.title }}</h1>
        <novel-attributes
            :art
            :post
            :attrs="[`read-count`, `word-count`, `publish-date`, `update-date`]"
        />
        <nuxt-link v-visible="art.prev" class="novel-adjacent-top" :to="art.prev?.route">
            <iconify name="fa7-solid:chevron-left"/>
            <span>{{ art.isFirstInVol ? "上一卷" : "上一章" }}</span>
        </nuxt-link>
        <nuxt-link v-visible="art.next" class="novel-adjacent-top" :to="art.next?.route">
            <iconify name="fa7-solid:chevron-right"/>
            <span>{{ art.isLastInVol ? "下一卷" : "下一章" }}</span>
        </nuxt-link>
    </header>
</template>

<style lang="scss" scoped>
    .novel-cover {
        height: 288px;
        margin: calc(-1 * var(--meow-large) + 8px);
        margin-bottom: 16px;
        border-radius: 8px;
        box-shadow: var(--box-shadow);
    }

    .novel-header {
        display: grid;
        grid-template:
            "C A D"
            "C B D" / auto 1fr auto;
        row-gap: 8px;
        margin-bottom: 16px;
    }

    .novel-title {
        padding-block: 2px;
        font-size: 24px;
        line-height: 32px;
        text-align: center;
    }

    .novel-adjacent-top {
        display: flex;
        align-items: center;
        font-weight: bold;
        color: var(--color-theme-text);

        &:first-of-type {
            grid-area: C;
        }

        &:last-of-type {
            flex-direction: row-reverse;
            grid-area: D;
        }

        @include viewport("md") {
            font-size: 0;
        }

        > .iconify {
            width: 1em;
            font-size: 42px;
        }
    }
</style>
