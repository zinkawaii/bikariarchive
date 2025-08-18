<script lang="ts" setup>
    defineProps<{
        art: Article;
    }>();
</script>

<template>
    <nuxt-link class="home-tabular content-widget" :to="art.route">
        <novel-cover class="tabular-cover" v-bind="art.cover"/>
        <div class="tabular-wrapper">
            <h2 class="tabular-title content-h2">
                <iconify v-if="art.sticky < Infinity" name="pepicons-print:pin"/>
                {{ art.title }}
            </h2>
            <novel-attributes
                :art
                :attrs="[`volume`, `word-count`, `publish-date`, `update-date`]"
            />
            <novel-article v-if="art.excerpt" class="p-small text-secondary" as="p" :body="art.excerpt"/>
            <p v-else class="p-small text-gray">这篇文章还没有简介。</p>
        </div>
        <span class="tabular-thumb"></span>
    </nuxt-link>
</template>

<style lang="scss" scoped>
    .home-tabular {
        display: flex;
        flex-direction: var(--direction);
        border-block: none;
        transition: all 0.25s;

        &:nth-of-type(2n) {
            --direction: row-reverse;
        }

        @include viewport(">sm") {
            &:hover {
                background-color: var(--color-background);
                translate: 0 -4px;
            }
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

    .tabular-thumb {
        width: 4px;
        height: 80px;
        margin: auto 8px;
        border-radius: var(--rounded-full);
        background-color: var(--color-theme-dark);

        @include viewport("sm") {
            display: none;
        }
    }
</style>
