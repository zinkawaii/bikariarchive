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
        <nav class="nav-list">
            <nuxt-link :to="{ name: `home` }">
                <i class="fas fa-house"></i>
                <span>主页</span>
            </nuxt-link>
            <nuxt-link :to="{ name: `catalogue` }">
                <i class="fas fa-book-open"></i>
                <span>目录</span>
            </nuxt-link>
            <nuxt-link :to="{ name: `details` }">
                <i class="fas fa-sitemap"></i>
                <span>情报</span>
            </nuxt-link>
            <nuxt-link :to="{ name: `friend` }">
                <i class="fas fa-link"></i>
                <span>友链</span>
            </nuxt-link>
            <nuxt-link :to="{ name: `borrowing` }">
                <i class="fas fa-person-praying"></i>
                <span>借物表</span>
            </nuxt-link>
            <nuxt-link :to="{ name: `chanrina` }">
                <i class="fas fa-torii-gate"></i>
                <span>神殿</span>
            </nuxt-link>
        </nav>
        <form class="search-wrapper" @submit.prevent="search">
            <input class="keyword" placeholder="输入关键词..." v-model="word"/>
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
        padding-inline: 16px;
        box-shadow: var(--box-shadow-dark);
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
        padding-inline: 16px;
    }

    .title {
        margin: auto;
        font-family: "腾祥沁圆简";
        font-size: 32px;
        text-shadow: 1px 1px 4px rgb(0 0 0 / 50%);
        color: white;

        &::before {
            content: "ʚ";
        }

        &::after {
            content: "ɞ";
        }
    }

    .nav-list {
        display: flex;
        min-width: fit-content;

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

            &:hover::after {
                scale: 1;
            }
        }
    }

    .nav-item {
        display: flex;
    }

    .search-wrapper {
        display: flex;
        overflow: hidden;
        margin-block: auto;
        margin-inline: 16px;
        border-radius: 8px;
        box-shadow: var(--box-shadow);
        font-size: 14px;
    }

    .keyword {
        flex: 1;
        width: 160px;
        padding: 0 8px;
        line-height: 28px;
    }

    .search {
        width: 48px;
        background: linear-gradient(to right, var(--color-theme-block), var(--color-theme-block-dark));
        color: white;
    }

    @media (width >= 768px) {
        .title-wrapper {
            max-width: 456px;
        }
    }

    @media (width < 1024px) {
        .search-wrapper {
            display: none;
        }
    }

    @media (width < 896px) {
        .nav-list span {
            display: none;
        }
    }

    @media (width < 768px) {
        .nav-list {
            display: none;
        }
    }
</style>