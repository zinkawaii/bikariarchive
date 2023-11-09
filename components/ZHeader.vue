<script setup>

</script>

<template>
    <div class="mb-header">
        <nuxt-link class="title" to="/home">BikariArchive</nuxt-link>
        <ul class="nav">
            <li class="nav-item">
                <nuxt-link to="/home">
                    <i class="fas fa-house"></i>
                    <span>主页</span>
                </nuxt-link>
            </li>
            <li class="nav-item">
                <nuxt-link to="/catalogue">
                    <i class="fas fa-book-open"></i>
                    <span>目录</span>
                </nuxt-link>
            </li>
            <li class="nav-item">
                <nuxt-link to="/details">
                    <i class="fas fa-sitemap"></i>
                    <span>情报</span>
                </nuxt-link>
            </li>
            <li class="nav-item">
                <nuxt-link to="/friend">
                    <i class="fas fa-link"></i>
                    <span>友链</span>
                </nuxt-link>
            </li>
            <li class="nav-item">
                <nuxt-link to="/borrowing">
                    <i class="fas fa-person-praying"></i>
                    <span>借物表</span>
                </nuxt-link>
            </li>
        </ul>
        <form class="retrieval" action="/search">
            <input class="entry" placeholder="输入关键词..." name="word"/>
            <button class="search" type="submit">
                <i class="fas fa-search"></i>
            </button>
        </form>
    </div>
</template>

<style lang="scss" scoped>
    .mb-header {
        display: flex;
        position: sticky;
        top: 0;
        height: 64px;
        min-width: fit-content;
        box-shadow: 0 0 8px rgb(0 0 0 / 33%);
        background:
            linear-gradient(
                to right,
                rgb(240 188 255 / 50%),
                rgb(240 255 188 / 50%),
                rgb(188 240 255 / 50%),
                rgb(188 255 240 / 50%)
            );
        backdrop-filter: blur(3px);
    }

    .title {
        min-width: fit-content;
        margin: auto;
        font-family: "腾祥沁圆简";
        font-size: 32px;
        text-shadow: 1px 1px 4px rgb(0 0 0 / 50%);
        color: white;
        cursor: pointer;

        &::before {
            content: "ʚ";
        }

        &::after {
            content: "ɞ";
        }
    }

    .nav {
        display: flex;
        min-width: fit-content;
        margin: 0;
        padding: 0;
    }

    .nav-item {
        display: flex;

        > a {
            display: flex;
            align-items: center;
            gap: 4px;
            position: relative;
            padding: 0 16px;
            text-shadow: var(--text-shadow);
            color: white;

            &::after {
                content: "";
                display: block;
                position: absolute;
                bottom: 14px;
                left: 12px;
                width: 0;
                height: 4px;
                border-radius: 2px;
                background-color: var(--color-theme-block-dark);
                transition: all 0.4s;
            }
        }

        &:hover a::after {
            width: calc(100% - 24px);
        }
    }

    .retrieval {
        display: flex;
        overflow: hidden;
        margin: 18px 32px 18px 16px;
        border-radius: 8px;
        box-shadow: 0 0 4px rgb(0 0 0 / 32%);
    }

    .entry {
        padding: 0 8px;
        font-size: 14px;
        line-height: 28px;
    }

    .search {
        width: 48px;
        background: linear-gradient(to right, var(--color-theme-block), var(--color-theme-block-dark));
        font-size: 14px;
        color: white;
        cursor: pointer;
    }

    @media (width >= 1174px) {
        .title {
            margin-left: 96px;
        }
    }

    @media (width < 1024px) {
        .mb-header {
            width: 100vw;
            min-width: var(--size-width-min-mobile);
        }

        .retrieval {
            display: none;
        }
    }

    @media (width < 768px) {
        .nav {
            display: none;
        }
    }
</style>