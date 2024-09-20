<script lang="ts" setup>
    import type { Article } from "~/utils/article";
    import type { GetArticleResponse } from "~~/server/types/api/article";

    defineProps<{
        art: Article;
        post?: GetArticleResponse;
    }>();
</script>

<template>
    <header class="novel-header">
        <nuxt-link v-visible="!art.isFirst" class="novel-adjacent-top" :to="art.prev?.route">
            <icon name="fa6-solid:chevron-left"/>
            <span>{{ art.isFirstInVol ? "上一卷" : "上一章" }}</span>
        </nuxt-link>
        <div>
            <h1 class="novel-title">{{ art.title }}</h1>
            <ul class="novel-information">
                <li>
                    <icon name="fa6-solid:eye"/>
                    <span>{{ post?.readCount ?? "?" }} 阅读</span>
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
        </div>
        <nuxt-link v-visible="!art.isLast" class="novel-adjacent-top" :to="art.next?.route">
            <span>{{ art.isLastInVol ? "下一卷" : "下一章" }}</span>
            <icon name="fa6-solid:chevron-right"/>
        </nuxt-link>
    </header>
</template>

<style lang="scss" scoped>
    .novel-header {
        display: grid;
        grid-template-columns: auto 1fr auto;
        margin-bottom: 16px;
    }

    .novel-title {
        padding-bottom: 8px;
        font-size: 24px;
        line-height: 36px;
        text-align: center;
    }

    .novel-information {
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

    .novel-adjacent-top {
        display: flex;
        align-items: center;
        font-weight: bold;
        color: var(--color-theme-text);

        @include viewport("md") {
            font-size: 0;
        }

        > .iconify {
            width: 1em;
            font-size: 42px;
        }
    }
</style>