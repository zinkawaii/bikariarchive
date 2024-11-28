<script lang="ts" setup>
    import type { BangumiData } from "~~/server/types/api/bangumi";

    defineProps<BangumiData>();
</script>

<template>
    <nuxt-link class="bangumi-item" :to="`https://bangumi.tv/subject/${id}`" target="_blank">
        <div class="bangumi-cover">
            <nuxt-img v-if="cover" class="bangumi-image" :src="cover" alt="[cover]" loading="lazy"/>
        </div>
        <div class="bangumi-info">
            <span class="text-truncate bangumi-title">{{ title.jp }}</span>
            <span class="text-truncate bangumi-trans">{{ title.zh }}</span>
            <div class="bangumi-tags">
                <time class="bangumi-tag">{{ date }}</time>
            </div>
        </div>
    </nuxt-link>
</template>

<style lang="scss" scoped>
    .bangumi-item {
        display: flex;
        gap: 16px;
        padding: 8px;
        border: 1px solid var(--color-border-lighter);
        border-radius: 16px;
        background-color: var(--color-background);
        transition: border-color 0.25s;

        &:hover {
            border-color: var(--color-theme-dark);

            .bangumi-title {
                color: var(--color-theme-text);
            }
        }
    }

    .bangumi-cover {
        overflow: hidden;
        width: 128px;
        aspect-ratio: 1 / 1.414;
        border-radius: 12px;
        background-color: var(--color-gray-900);

        @include viewport("sm") {
            width: 96px;
        }
    }

    .bangumi-image {
        height: 100%;
        object-fit: cover;
    }

    .bangumi-info {
        display: grid;
        flex: 1;
        grid-template-rows: auto auto 1fr;
        align-items: center;
        gap: 8px;
        margin-block: 36px 20px;

        @include viewport("sm") {
            margin-block: 16px 12px;
        }
    }

    .bangumi-title {
        font-size: 21px;
        font-weight: bold;
        transition: all 0.25s;
    }

    .bangumi-trans {
        font-size: 17px;
        font-weight: bold;
        color: var(--color-info);
    }

    .bangumi-tags {
        display: flex;
        gap: 8px;
    }

    .bangumi-tag {
        padding-inline: 12px;
        border: 1px solid var(--color-border-light);
        border-radius: var(--bounded-full);
        font-size: 14px;
        line-height: 24px;
        color: var(--color-info);
    }
</style>