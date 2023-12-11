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
    <header class="z-header">
        <div class="title-wrapper">
            <nuxt-link :to="{ name: `home` }">BikariArchive</nuxt-link>
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
    </header>
</template>

<style lang="scss" scoped>
    .z-header {
        display: grid;
        grid-template-columns: 1fr auto auto;
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
        font-size: 14px;
    }

    $title: 297px;
    $item-max: 60px;
    $item-min: 48px;
    $count: 6;
    $nav-max: $item-max * $count;
    $nav-min: $item-min * $count;
    $padding: 16px * 2;
    $max: $title + $nav-max + $padding;
    $min: $title + $nav-min + $padding;

    .title-wrapper {
        display: flex;
        width: 100%;
        margin-right: auto;
        padding-inline: 16px;

        > a {
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

        @media (width >= #{$min}) {
            max-width: 456px;
        }
    }

    .nav-list {
        display: flex;

        > a {
            display: grid;
            place-content: center;
            gap: 4px;
            width: $item-max;
            text-shadow: var(--text-shadow);
            color: white;

            > i {
                transition: translate 0.2s;
            }

            &:hover > i {
                translate: 0 -4px;
            }
        }

        @media (width < #{$max}) {
            > a {
                width: $item-min;
            }

            span {
                display: none;
            }
        }

        @media (width < #{$min}) {
            display: none;
        }
    }

    .search-wrapper {
        display: flex;
        overflow: hidden;
        margin: auto 16px;
        border-radius: 8px;
        box-shadow: var(--box-shadow);
    }

    .keyword {
        width: 160px;
        padding: 0 8px;
        line-height: 28px;
    }

    .search {
        width: 48px;
        background: linear-gradient(to right, var(--color-theme-block), var(--color-theme-block-dark));
        color: white;
    }

    @media (width < 1024px) {
        .search-wrapper {
            display: none;
        }
    }
</style>