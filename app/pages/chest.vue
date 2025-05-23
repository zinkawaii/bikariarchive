<script lang="ts" setup>
    useHead({
        title: "工具箱",
    });

    const tools = [
        {
            title: "日文名发生装置",
            description: "治好了孩子的起名困难症",
            icon: "material-symbols:language-japanese-kana",
            to: { name: "namaemaker" },
        },
        {
            title: "歌词打轴",
            description: "为你的歌词快速打轴",
            icon: "mdi:timeline-clock",
            to: { name: "lyricaxis" },
        },
    ];
</script>

<template>
    <meow-widget title="工具箱">
        <div class="chest-list">
            <nuxt-link v-for="{ title, description, icon, to } in tools" class="chest-item" :to>
                <div class="chest-icon">
                    <iconify :name="icon ?? `fa6-solid:wrench`"/>
                </div>
                <div class="chest-title">
                    <h3>{{ title }}</h3>
                    <span class="chest-underline"></span>
                </div>
                <p class="p-small text-truncate text-gray">{{ description }}</p>
            </nuxt-link>
        </div>
    </meow-widget>
</template>

<style lang="scss" scoped>
    .chest-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 16px;
    }

    .chest-item {
        display: grid;
        grid-template:
            "A B"
            "A C" / auto 1fr;
        align-items: center;
        column-gap: 12px;

        &:hover {
            color: var(--color-theme-text);

            .chest-underline::before {
                width: 100%;
            }
        }
    }

    .chest-icon {
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

    .chest-title {
        display: grid;
        gap: 4px;
        line-height: 28px;
        transition: color 0.25s;
    }

    .chest-underline {
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
