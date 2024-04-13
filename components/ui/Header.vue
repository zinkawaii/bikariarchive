<script setup>
    const router = useRouter();
    const word = ref("");

    const navList = [
        {
            title: "主页",
            icon: "fa6-solid:house",
            to: { name: "home" }
        },
        {
            title: "目录",
            icon: "fa6-solid:book-open",
            to: { name: "catalogue" }
        },
        {
            title: "情报",
            icon: "fa6-solid:sitemap",
            to: { name: "details" }
        },
        {
            title: "档案",
            icon: "fa6-solid:box-archive",
            children: [
                {
                    title: "借物表",
                    icon: "fa6-solid:person-praying",
                    to: { name: "borrowing" }
                },
                {
                    title: "神殿",
                    icon: "fa6-solid:torii-gate",
                    to: { name: "chanrina" }
                }
            ]
        },
        {
            title: "营业",
            icon: "fa6-solid:mug-saucer",
            children: [
                {
                    title: "更新日志",
                    icon: "fa6-solid:clock-rotate-left",
                    to: { name: "update" }
                },
                {
                    title: "关于",
                    icon: "fa-solid:info-circle",
                    to: { name: "about" }
                }
            ]
        },
        {
            title: "链接",
            icon: "fa6-solid:link",
            children: [
                {
                    title: "友情链接",
                    icon: "fa-solid:user-friends",
                    to: { name: "friend" }
                }
            ]
        }
    ];

    function search() {
        router.push(toSearch(word.value));
        word.value = "";
    }
</script>

<template>
    <header class="z-header">
        <div class="header-title">
            <nuxt-link :to="{ name: `home` }">BikariArchive</nuxt-link>
        </div>
        <nav class="header-nav">
            <mb-popper v-for="{ title, icon, to, children } in navList">
                <nuxt-link class="nav-link" :to="to">
                    <icon :name="icon" :width="null"/>
                    <span>{{ title }}</span>
                </nuxt-link>
                <template v-if="children?.length" #floating>
                    <nuxt-link v-for="child in children" class="nav-pop" :to="child.to">
                        <icon :name="child.icon"/>
                        <span>{{ child.title }}</span>
                    </nuxt-link>
                </template>
            </mb-popper>
        </nav>
        <form class="header-search" @submit.prevent="search">
            <input type="search" placeholder="输入关键词..." v-model="word"/>
            <button>
                <icon name="fa-solid:search"/>
            </button>
        </form>
    </header>
</template>

<style lang="scss" scoped>
    .z-header {
        display: grid;
        grid-template-columns: 1fr auto auto;
        position: sticky;
        overflow-x: clip;
        top: 0;
        height: 64px;
        min-width: var(--size-min-width);
        padding-inline: 16px;
        box-shadow: var(--box-shadow-darker);
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

    .header-title {
        display: flex;
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

    .header-nav {
        display: flex;
        margin-block: auto;

        @media (width < #{$min}) {
            display: none;
        }
    }

    .nav-link {
        display: grid;
        justify-items: center;
        gap: 4px;
        width: $item-max;
        margin: auto;
        color: white;
        filter: drop-shadow(var(--text-shadow));

        > svg {
            transition: translate 0.2s;
        }

        &:hover > svg {
            translate: 0 -4px;
        }

        @media (width < #{$max}) {
            width: $item-min;

            span {
                display: none;
            }
        }
    }

    .nav-pop {
        display: grid;
        grid-template-columns: 16px 1fr;
        gap: 6px;
        width: 100px;
        padding-inline: 10px;
        border-radius: 8px;
        line-height: 32px;
        word-break: keep-all;
        transition: all 0.25s;

        &:hover {
            background-color: var(--color-theme);
            color: white;
        }

        > svg {
            margin: auto;
        }
    }

    .header-search {
        display: grid;
        grid-template-columns: 160px 48px;
        overflow: hidden;
        margin: auto 16px;
        border-radius: 8px;
        box-shadow: var(--box-shadow);
        line-height: 28px;

        @media (width < 1024px) {
            display: none;
        }

        > input {
            padding-inline: 8px;
        }

        > button {
            display: grid;
            place-items: center;
            background: linear-gradient(to right, var(--color-theme), var(--color-theme-dark));
            color: white;
        }
    }
</style>