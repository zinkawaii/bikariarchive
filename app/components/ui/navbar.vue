<script lang="ts" setup>
    const settingStore = useSettingStore();
    const shelfStore = useShelfStore();

    const links = [
        {
            title: "主页",
            icon: "fa6-solid:house",
            to: { name: "home" }
        },
        {
            title: "目录",
            icon: "fa6-solid:book-open",
            to: computed(() => shelfStore.route)
        },
        {
            title: "情报",
            icon: "fa6-solid:sitemap",
            to: { name: "intel" }
        },
        {
            title: "检索",
            icon: "fa6-solid:magnifying-glass",
            to: { name: "search" }
        }
    ];
</script>

<template>
    <nav class="z-navbar" :class="{ [`is-collapse`]: settingStore.get(`ui-collapse`) }">
        <ul class="nav-list">
            <li v-for="{ title, icon, to } in links" class="nav-item">
                <!-- @vue-expect-error -->
                <nuxt-link class="nav-link" :to>
                    <iconify :name="icon"/>
                    <span class="nav-title">{{ title }}</span>
                </nuxt-link>
            </li>
        </ul>
    </nav>
</template>

<style lang="scss" scoped>
    .z-navbar {
        position: fixed;
        width: 48px;
        height: fit-content;
        margin-block: auto;
        box-shadow: 4px 4px 8px rgb(0 0 0 / 24%);
        background-color: var(--color-background);
        transition: all 0.4s;
        inset-block: 0;

        &:hover {
            width: 116px;

            .nav-title {
                opacity: 1;
            }
        }

        &.is-collapse {
            translate: -100%;
        }
    }

    .nav-list {
        overflow: hidden;
        border-block: 16px solid var(--color-theme);
    }

    .nav-item {
        display: flex;
        height: 64px;
        padding-left: 16px;
        transition: margin-left 0.4s;
        user-select: none;

        &:not(:hover) {
            margin-left: -16px;
        }
    }

    .nav-link {
        display: flex;
        flex: 1;
        align-items: center;
        gap: 4px;
        border-radius: 12px 0 0 12px;
        word-break: keep-all;

        :hover > & {
            background-color: rgb(64 64 64);
            color: white;
        }

        > .iconify {
            width: 48px;
            font-size: 21px;
        }
    }

    .nav-title {
        opacity: 0;
        transition: opacity 0.4s;
    }
</style>