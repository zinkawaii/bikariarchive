<script lang="ts" setup>
    const settingStore = useSettingStore();

    const links = [
        {
            title: "主页",
            name: "home",
            icon: "fa6-solid:house"
        },
        {
            title: "目录",
            name: "shelf",
            icon: "fa6-solid:book-open"
        },
        {
            title: "情报",
            name: "details",
            icon: "fa6-solid:sitemap"
        },
        {
            title: "检索",
            name: "search",
            icon: "fa6-solid:magnifying-glass"
        }
    ];
</script>

<template>
    <nav class="z-navbar" :class="{ [`is-collapse`]: settingStore.setting[`ui-collapse`] }">
        <ul class="nav-list">
            <li v-for="{ title, name, icon } in links" class="nav-item">
                <nuxt-link class="nav-link" :to="{ name }">
                    <icon :name="icon"/>
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
        transition: all 0.4s;
    }
</style>