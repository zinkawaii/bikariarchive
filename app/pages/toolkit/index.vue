<script lang="ts" setup>
    import type { RouteLocationRaw } from "vue-router";

    useHead({
        title: "工具箱",
    });

    const toolkit: {
        title: string;
        description: string;
        icon: string;
        to: RouteLocationRaw;
    }[] = [
        {
            title: "日文名发生装置",
            description: "治好了孩子的起名困难症",
            icon: "material-symbols:language-japanese-kana",
            to: { name: "toolkit-namaemaker" },
        },
        {
            title: "歌词打轴",
            description: "为你的歌词快速打轴",
            icon: "mdi:timeline-clock",
            to: { name: "toolkit-lyricaxis" },
        },
    ];
</script>

<template>
    <meow-widget title="工具箱">
        <div class="toolkit-list">
            <nuxt-link v-for="{ title, description, icon, to } in toolkit" class="toolkit-item" :to>
                <div class="toolkit-icon">
                    <iconify :name="icon ?? `fa7-solid:wrench`"/>
                </div>
                <div class="toolkit-title">
                    <h3>{{ title }}</h3>
                    <span class="toolkit-underline"></span>
                </div>
                <p class="p-small text-truncate text-gray">{{ description }}</p>
            </nuxt-link>
        </div>
    </meow-widget>
</template>

<style lang="scss" scoped>
    .toolkit-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 16px;
    }

    .toolkit-item {
        display: grid;
        grid-template:
            "A B"
            "A C" / auto 1fr;
        align-items: center;
        column-gap: 12px;

        &:hover {
            color: var(--color-theme-text);

            .toolkit-underline::before {
                width: 100%;
            }
        }
    }

    .toolkit-icon {
        display: grid;
        grid-area: A;
        place-items: center;
        width: 64px;
        aspect-ratio: 1;
        border: 3px dashed var(--color-border);
        border-radius: 8px;
        font-size: 24px;
        color: var(--color-info);
    }

    .toolkit-title {
        display: grid;
        gap: 4px;
        line-height: 28px;
        transition: color 0.25s;
    }

    .toolkit-underline {
        height: 1px;
        background-color: var(--color-border-lighter);

        &::before {
            content: "";
            display: block;
            width: 0;
            height: 1px;
            background-color: var(--color-theme-dark);
            transition: all 0.4s;
        }
    }
</style>
