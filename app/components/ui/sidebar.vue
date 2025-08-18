<script lang="ts" setup>
    import { animate, utils } from "animejs";

    const settingStore = useSettingStore();
    const route = useRoute();

    const isSmallWindow = useMediaQuery("(width < 1024px)");

    const isCollapse = computed(() => {
        const collapse = settingStore.get("ui-collapse");
        const display = settingStore.get("sidebar-display");
        return {
            0: collapse,
            1: false,
            2: true,
        }[display]!;
    });

    watch(isCollapse, async () => {
        if (isSmallWindow.value) {
            return;
        }

        const nakami = document.querySelector(".nakami")!;
        const start = getPosition(nakami);
        await nextTick();
        const end = getPosition(nakami);

        animate(nakami, {
            x: [start.left - end.left, 0],
            y: [start.top - end.top, 0],
            duration: 400,
            ease: "outBack",
        });
    });

    watch(() => settingStore.get("ui-collapse"), async (collapse) => {
        if (!isSmallWindow.value) {
            return;
        }

        await nextTick();
        const widgets = document.querySelectorAll(".aside-widget");

        animate(widgets, {
            opacity: 1,
            y: ["4rem", 0],
            duration: 400,
            delay: (el, i) => i * 50,
            ease: "outBack",
            reversed: collapse,
            onComplete: utils.cleanInlineStyles,
        });
    });

    function onClick(event: MouseEvent) {
        if (isSmallWindow.value && event.target === event.currentTarget) {
            settingStore.set("ui-collapse", true);
        }
    }
</script>

<template>
    <aside
        class="z-sidebar"
        :class="{
            [`is-collapse`]: isCollapse,
            [`is-shown`]: !settingStore.get(`ui-collapse`),
        }"
        @click="onClick"
    >
        <aside-widget class="aside-profile">
            <nuxt-img class="aside-avatar" :src="$config.public.avatar" alt="[avatar]"/>
            <span class="aside-author content-h2">{{ $config.public.author }}</span>
            <p class="p-small">うたかたなしあわせ</p>
        </aside-widget>
        <aside-widget title="公告">
            <template #icon>
                <iconify name="fa7-solid:bullhorn"/>
            </template>
            <p class="p-small">
                欢迎来到<span class="text-primary">{{ $config.public.title }}</span>！(｡･ ω&lt;)ゞ♡<br />
                小说正在缓慢更新中……
            </p>
        </aside-widget>
        <div class="aside-sticky">
            <aside-unified v-if="route.meta.catalog"/>
            <aside-widget title="最近更新">
                <template #icon>
                    <iconify name="fa7-solid:clock-rotate-left"/>
                </template>
                <recent-article :sizes="5" sort-by="updated"/>
            </aside-widget>
        </div>
    </aside>
</template>

<style lang="scss" scoped>
    .z-sidebar {
        margin-top: -16px;

        @include viewport(">lg") {
            &.is-collapse {
                display: none;
            }
        }

        @include viewport("lg") {
            display: grid;
            grid-template-columns: 256px;
            justify-content: center;
            position: fixed;
            overflow: auto;
            inset: 80px 0 0;
            padding-bottom: 16px;
            backdrop-filter: blur(4px);
            transition: all 0.4s;
            overscroll-behavior: contain;

            &:not(.is-shown) {
                opacity: 0;
                pointer-events: none;
            }

            &::-webkit-scrollbar {
                display: none;
            }
        }
    }

    .aside-profile {
        display: grid;
        justify-items: center;
    }

    .aside-avatar {
        width: 96px;
        aspect-ratio: 1;
        border-radius: 24px;
        filter: drop-shadow(0 0 2px rgb(0 0 0 / 16%));
    }

    .aside-author {
        padding-block: 12px 4px;
    }

    .aside-sticky {
        position: sticky;
        top: 80px;
    }
</style>
