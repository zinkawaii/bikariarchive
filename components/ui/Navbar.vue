<script setup>
    const settingStore = useSettingStore();

    const links = [
        {
            title: "主页",
            name: "home",
            icon: "house"
        },
        {
            title: "目录",
            name: "catalogue",
            icon: "book-open"
        },
        {
            title: "情报",
            name: "details",
            icon: "sitemap"
        },
        {
            title: "检索",
            name: "search",
            icon: "search"
        }
    ];
</script>

<template>
    <nav class="z-navbar" :class="{ collapse: settingStore.get(`ui-collapse`) }">
        <ul class="nav-list">
            <li v-for="{ title, name, icon } in links" class="nav-item">
                <nuxt-link class="nav-link" :to="{ name }">
                    <fa :icon="icon"/>
                    <span>{{ title }}</span>
                </nuxt-link>
            </li>
        </ul>
    </nav>
</template>

<style lang="scss" scoped>
    .z-navbar {
        position: fixed;
        top: calc(50% - 144px);
        width: 48px;
        box-shadow: 4px 4px 8px rgb(0 0 0 / 33%);
        background-color: var(--color-background);
        transition: all 0.4s;

        &:hover {
            width: 116px;

            .nav-link > span {
                opacity: 1;
            }
        }

        &.collapse {
            opacity: 0;
            transform: translateX(-48px);
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

        > svg {
            width: 48px;
            font-size: 21px;
        }

        > span {
            opacity: 0;
            transition: all 0.4s;
        }
    }
</style>