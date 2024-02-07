<script setup>
    const route = useRoute();
    const settingStore = useSettingStore();

    //边栏显隐与UI折叠
    const display = ref(true);
    watch(() => [
        settingStore.setting["sidebar-display"],
        settingStore.setting["ui-collapse"]
    ], ([s, u]) => {
        display.value = {
            0: !u,
            1: true,
            2: false
        }[s];
    }, {
        immediate: true
    });
</script>

<template>
    <aside class="z-sidebar" :class="{ hidden: !display }">
        <aside-widget class="aside-profile">
            <mb-image class="aside-avatar" :src="$config.public.avatar"/>
            <span class="content-h2 aside-author">{{ $config.public.author }}</span>
            <p class="p-small">うたかたなしあわせ</p>
        </aside-widget>
        <aside-widget title="公告" icon="bullhorn">
            <p class="p-small">
                欢迎来到<span class="text-primary">微光档案</span>！(｡･ ω&lt;)ゞ♡<br />
                小说正在缓慢更新中……
            </p>
        </aside-widget>
        <div class="aside-sticky">
            <aside-catalog v-if="route.name === `reader`"/>
            <aside-widget class="aside-update" title="最近更新" icon="clock-rotate-left">
                <recent-article type="blog" :limit="5" sort-by="updated"/>
            </aside-widget>
        </div>
    </aside>
</template>

<style lang="scss" scoped>
    .z-sidebar {
        width: 256px;
    }

    .aside-profile {
        display: grid;
        justify-items: center;
        margin-top: 0;
    }

    .aside-avatar {
        width: 96px;
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

    .aside-update {
        font-size: 14px;
    }

    @media (width >= 1024px) {
        .z-sidebar.hidden {
            display: none;
        }
    }

    @media (width < 1024px) {
        .z-sidebar {
            margin: auto;
        }
    }
</style>