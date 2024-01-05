<script setup>
    const router = useRouter();
    const word = ref("");

    function search() {
        router.push(toSearch(word.value));
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
                <fa-icon icon="house"/>
                <span>主页</span>
            </nuxt-link>
            <nuxt-link :to="{ name: `catalogue` }">
                <fa-icon icon="book-open"/>
                <span>目录</span>
            </nuxt-link>
            <nuxt-link :to="{ name: `details` }">
                <fa-icon icon="sitemap"/>
                <span>情报</span>
            </nuxt-link>
            <nuxt-link :to="{ name: `friend` }">
                <fa-icon icon="link"/>
                <span>友链</span>
            </nuxt-link>
            <nuxt-link :to="{ name: `borrowing` }">
                <fa-icon icon="person-praying"/>
                <span>借物表</span>
            </nuxt-link>
            <nuxt-link :to="{ name: `chanrina` }">
                <fa-icon icon="torii-gate"/>
                <span>神殿</span>
            </nuxt-link>
        </nav>
        <form class="search-wrapper" @submit.prevent="search">
            <input class="keyword" type="search" placeholder="输入关键词..." v-model="word"/>
            <button class="search">
                <fa-icon icon="search"/>
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
        min-width: var(--size-min-width);
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
            font-family: var(--font-smooth);
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
            align-content: center;
            justify-items: center;
            gap: 4px;
            width: $item-max;
            color: white;
            filter: drop-shadow(var(--text-shadow));

            > svg {
                transition: translate 0.2s;
            }

            &:hover > svg {
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
        padding-inline: 8px;
        line-height: 28px;
    }

    .search {
        width: 48px;
        background: linear-gradient(to right, var(--color-theme), var(--color-theme-dark));
        color: white;
    }

    @media (width < 1024px) {
        .search-wrapper {
            display: none;
        }
    }
</style>