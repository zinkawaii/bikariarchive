<script setup>
    const settingStore = useSettingStore();
</script>

<template>
    <div class="mb-navbar" :class="{ collapse: settingStore.setting[`ui-collapse`] }">
        <ul class="list">
            <li class="item">
                <nuxt-link href="/home">
                    <i class="fas fa-house"></i>
                    <span>主页</span>
                </nuxt-link>
            </li>
            <li class="item">
                <nuxt-link href="/catalogue">
                    <i class="fas fa-book-open"></i>
                    <span>目录</span>
                </nuxt-link>
            </li>
            <li class="item">
                <nuxt-link href="/details">
                    <i class="fas fa-sitemap"></i>
                    <span>情报</span>
                </nuxt-link>
            </li>
            <li class="item">
                <nuxt-link href="/search">
                    <i class="fas fa-search"></i>
                    <span>检索</span>
                </nuxt-link>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
    .mb-navbar {
        position: fixed;
        overflow: hidden;
        top: calc(50% - 144px);
        left: -32px;
        width: 80px;
        box-shadow: 4px 4px 8px rgb(0 0 0 / 33%);
        transition: all 0.4s;

        &:hover {
            width: 148px;

            .item span {
                opacity: 1;
            }
        }

        &.collapse {
            opacity: 0;
            transform: translateX(-48px);
        }
    }

    .list {
        display: flex;
        flex-direction: column;
        border: 16px solid var(--color-theme-block);
        border-right: 0;
    }

    .item {
        display: flex;
        position: relative;
        left: 0;
        height: 64px;
        padding-left: 16px;
        background-color: var(--color-background);
        transition: left 0.4s;
        user-select: none;

        &:hover {
            left: 16px;

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
            color: var(--color-text);

            > i {
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