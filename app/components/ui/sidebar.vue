<script lang="ts" setup>
    import Flip from "gsap/Flip";

    const settingStore = useSettingStore();
    const route = useRoute();

    const isCollapse = ref(false);

    //边栏显隐与 UI 折叠
    watchEffect(() => {
        const collapse = settingStore.get("ui-collapse");
        const display = settingStore.get("sidebar-display");

        if (import.meta.browser) {
            const nakamiState = Flip.getState(".nakami");
            nextTick(() => {
                Flip.from(nakamiState, {
                    duration: 0.4,
                    ease: "back.out"
                });
            });
        }

        isCollapse.value = {
            0: collapse,
            1: false,
            2: true
        }[display]!;
    });
</script>

<template>
    <aside class="z-sidebar" :class="{ [`is-collapse`]: isCollapse }">
        <aside-widget class="aside-profile">
            <nuxt-img class="aside-avatar" :src="$config.public.avatar" alt="[avatar]"/>
            <span class="aside-author content-h2">{{ $config.public.author }}</span>
            <p class="p-small">うたかたなしあわせ</p>
        </aside-widget>
        <aside-widget title="公告">
            <template #icon>
                <iconify name="fa6-solid:bullhorn"/>
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
                    <iconify name="fa6-solid:clock-rotate-left"/>
                </template>
                <recent-article :sizes="5" sort-by="updated"/>
            </aside-widget>
        </div>
    </aside>
</template>

<style lang="scss" scoped>
    .z-sidebar {
        width: 256px;
        margin-top: -16px;

        @include viewport(">lg") {
            &.is-collapse {
                display: none;
            }
        }

        @include viewport("lg") {
            margin-inline: auto;
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