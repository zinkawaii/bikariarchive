<script setup>
    const settingStore = useSettingStore();
</script>

<template>
    <nav class="z-navbar" :class="{ collapse: settingStore.get(`ui-collapse`) }">
        <ul class="nav-list">
            <li class="nav-item">
                <nuxt-link :to="{ name: `home` }">
                    <fa icon="house"/>
                    <span>主页</span>
                </nuxt-link>
            </li>
            <li class="nav-item">
                <nuxt-link :to="{ name: `catalogue` }">
                    <fa icon="book-open"/>
                    <span>目录</span>
                </nuxt-link>
            </li>
            <li class="nav-item">
                <nuxt-link :to="{ name: `details` }">
                    <fa icon="sitemap"/>
                    <span>情报</span>
                </nuxt-link>
            </li>
            <li class="nav-item">
                <nuxt-link :to="{ name: `search` }">
                    <fa icon="search"/>
                    <span>检索</span>
                </nuxt-link>
            </li>
        </ul>
    </nav>
</template>

<style lang="scss" scoped>
    .z-navbar {
        position: fixed;
        top: calc(50% - 144px);
        left: -16px;
        width: 64px;
        box-shadow: 4px 4px 8px rgb(0 0 0 / 33%);
        transition: all 0.4s;

        &:hover {
            width: 132px;

            .nav-item span {
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
        background-color: var(--color-background);
        transition: margin-left 0.4s;
        user-select: none;

        &:hover {
            margin-left: 16px;

            > a {
                background-color: rgb(64 64 64);
                color: white;
            }
        }

        > a {
            display: flex;
            flex: 1;
            align-items: center;
            gap: 4px;
            border-radius: 12px;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;

            > svg {
                width: 48px;
                font-size: 21px;
            }

            > span {
                opacity: 0;
                word-break: keep-all;
                transition: all 0.4s;
            }
        }
    }
</style>