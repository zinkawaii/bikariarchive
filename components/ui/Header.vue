<script setup>
    const router = useRouter();
    const word = ref("");

    function search() {
        router.push({
            name: "search",
            query: {
                word: word.value
            }
        });
        word.value = "";
    }
</script>

<template>
    <div class="z-header">
        <div class="title-wrapper">
            <nuxt-link class="title" :to="{ name: `home` }">BikariArchive</nuxt-link>
        </div>
        <ul class="nav">
            <li class="nav-item">
                <nuxt-link :to="{ name: `home` }">
                    <i class="fas fa-house"></i>
                    <span>主页</span>
                </nuxt-link>
            </li>
            <li class="nav-item">
                <nuxt-link :to="{ name: `catalogue` }">
                    <i class="fas fa-book-open"></i>
                    <span>目录</span>
                </nuxt-link>
            </li>
            <li class="nav-item">
                <nuxt-link :to="{ name: `details` }">
                    <i class="fas fa-sitemap"></i>
                    <span>情报</span>
                </nuxt-link>
            </li>
            <li class="nav-item">
                <nuxt-link :to="{ name: `friend` }">
                    <i class="fas fa-link"></i>
                    <span>友链</span>
                </nuxt-link>
            </li>
            <li class="nav-item">
                <nuxt-link :to="{ name: `borrowing` }">
                    <i class="fas fa-person-praying"></i>
                    <span>借物表</span>
                </nuxt-link>
            </li>
        </ul>
        <form class="retrieval" @submit.prevent="search">
            <input class="entry" placeholder="输入关键词..." v-model="word"/>
            <button class="search">
                <i class="fas fa-search"></i>
            </button>
        </form>
    </div>
</template>

<style lang="scss" scoped>
    .z-header {
        display: flex;
        position: sticky;
        top: 0;
        height: 64px;
        min-width: var(--size-width-min-mobile);
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

    .title-wrapper {
        display: flex;
        flex: 1;
        margin-right: auto;
    }

    .title {
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
                position: absolute;
                bottom: 14px;
                width: calc(100% - 24px);
                height: 4px;
                border-radius: 2px;
                background-color: var(--color-theme-block-dark);
                transform-origin: left;
                transition: all 0.4s;
                scale: 0 1;
                translate: -4px;
            }
        }

        &:hover a::after {
            scale: 1;
        }
    }

    .retrieval {
        display: flex;
        overflow: hidden;
        margin-block: auto;
        margin-inline: 16px 32px;
        border-radius: 8px;
        box-shadow: var(--box-shadow);
    }

    .entry {
        width: 160px;
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

    @media (width >= 768px) {
        .title-wrapper {
            max-width: 456px;
        }
    }

    @media (width < 1024px) {
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