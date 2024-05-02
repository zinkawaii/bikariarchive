<script lang="ts" setup>
    import { Flip } from "gsap/all";

    const route = useRoute();
    const settingStore = useSettingStore();

    const isHidden = ref(false);

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

        isHidden.value = {
            0: collapse,
            1: false,
            2: true
        }[display];
    });
</script>

<template>
    <aside class="z-sidebar" :class="{ [`is-hidden`]: isHidden }">
        <aside-widget class="aside-profile">
            <nuxt-img class="aside-avatar" :src="$config.public.avatar" alt="avatar"/>
            <span class="content-h2 aside-author">{{ $config.public.author }}</span>
            <p class="p-small">うたかたなしあわせ</p>
        </aside-widget>
        <aside-widget title="公告">
            <template #icon>
                <icon name="fa6-solid:bullhorn"/>
            </template>
            <p class="p-small">
                欢迎来到<span class="text-primary">{{ $config.public.title }}</span>！(｡･ ω&lt;)ゞ♡<br />
                小说正在缓慢更新中……
            </p>
        </aside-widget>
        <div class="aside-sticky">
            <aside-catalog v-if="route.name === `reader`"/>
            <aside-widget class="text-small" title="最近更新">
                <template #icon>
                    <icon name="fa6-solid:clock-rotate-left"/>
                </template>
                <recent-article type="blog" :limit="5" sort-by="updated"/>
            </aside-widget>
        </div>
    </aside>
</template>

<style lang="scss" scoped>
    .z-sidebar {
        width: 256px;

        @media (width >= 1024px) {
            &.is-hidden {
                display: none;
            }
        }

        @media (width < 1024px) {
            margin: auto;
        }

        > :first-child {
            margin-top: 0;
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
        box-shadow: var(--box-shadow);
    }

    .aside-author {
        padding-block: 12px 4px;
    }

    .aside-sticky {
        position: sticky;
        top: 80px;
    }
</style>