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
            <h3 class="bangumi-title text-truncate">{{ title.jp }}</h3>
            <span class="bangumi-trans text-truncate">{{ title.zh }}</span>
            <ul class="bangumi-tags">
                <li class="bangumi-tag">
                    <iconify name="fa6-solid:circle-play"/>
                    <time>{{ date }}</time>
                </li>
            </ul>
        </div>
    </nuxt-link>
</template>

<style lang="scss" scoped>
    .bangumi-item {
        display: flex;
        gap: 12px;
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
        width: 64px;
        aspect-ratio: 1 / 1.414;
        border-radius: 4px;
        background-color: var(--color-gray-900);
    }

    .bangumi-image {
        height: 100%;
        object-fit: cover;
    }

    .bangumi-info {
        display: grid;
        flex: 1;
        gap: 9px;
        margin-block: auto;
    }

    .bangumi-title {
        transition: all 0.25s;
    }

    .bangumi-trans {
        font-size: 14px;
        color: var(--color-info);
    }

    .bangumi-tags {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: var(--color-info);
    }

    .bangumi-tag {
        display: contents;
    }
</style>
