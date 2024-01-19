<script setup>
    const router = useRouter();
    const word = ref("");

    const navList = [
        {
            title: "主页",
            icon: "house",
            to: { name: "home" }
        },
        {
            title: "目录",
            icon: "book-open",
            to: { name: "catalogue" }
        },
        {
            title: "情报",
            icon: "sitemap",
            to: { name: "details" }
        },
        {
            title: "档案",
            icon: "box-archive",
            children: [
                {
                    title: "借物表",
                    icon: "person-praying",
                    to: { name: "borrowing" }
                },
                {
                    title: "神殿",
                    icon: "torii-gate",
                    to: { name: "chanrina" }
                }
            ]
        },
        {
            title: "营业",
            icon: "mug-saucer",
            children: [
                {
                    title: "更新日志",
                    icon: "clock-rotate-left",
                    to: { name: "update" }
                }
            ]
        },
        {
            title: "链接",
            icon: "link",
            children: [
                {
                    title: "友情链接",
                    icon: "link",
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
            <div v-for="{ title, icon, to, children } in navList" class="nav-item">
                <nuxt-link class="nav-link" :to="to">
                    <fa-icon :icon="icon"/>
                    <span>{{ title }}</span>
                </nuxt-link>
                <div v-if="children?.length > 0" class="nav-popup-wrapper">
                    <div class="nav-popup">
                        <nuxt-link v-for="child in children" :to="child.to">
                            <fa-icon :icon="child.icon"/>
                            <span>{{ child.title }}</span>
                        </nuxt-link>
                    </div>
                </div>
            </div>
        </nav>
        <form class="header-search" @submit.prevent="search">
            <input type="search" placeholder="输入关键词..." v-model="word"/>
            <button>
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
        overflow-x: clip;
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

    .header-title {
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

    .header-nav {
        display: flex;

        @media (width < #{$min}) {
            display: none;
        }
    }

    .nav-item {
        display: grid;
        justify-items: center;
        position: relative;
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

    .nav-popup-wrapper {
        position: absolute;
        opacity: 0;
        top: 50px;
        padding: 8px;
        transform-origin: top;
        transition: all 0.25s;
        scale: 1 0.66;
        filter: drop-shadow(2px 2px 8px rgb(0 0 0 / 32%));
        pointer-events: none;

        &::before {
            content: "";
            position: absolute;
            inset: 4px 0;
            width: 10px;
            aspect-ratio: 1;
            margin-inline: auto;
            background-color: var(--color-background-alpha);
            clip-path: polygon(0 0, 0 100%, 100% 0);
            rotate: 45deg;
        }

        :hover + &, &:hover {
            opacity: 1;
            scale: 1;
            pointer-events: auto;
        }
    }

    .nav-popup {
        display: grid;
        width: 112px;
        padding: 6px;
        border: 1px solid transparent;
        border-radius: 12px;
        background-color: var(--color-background-alpha);

        [z-dark] & {
            border-color: var(--color-border-lighter);
        }

        > a {
            display: grid;
            grid-template-columns: 16px 1fr;
            gap: 6px;
            padding-inline: 10px;
            border-radius: 8px;
            line-height: 32px;
            word-break: keep-all;
            transition: all 0.25s;

            &:hover {
                background-color: var(--color-theme);
                color: white;
            }
        }

        svg {
            margin: auto;
        }
    }

    .header-search {
        display: flex;
        overflow: hidden;
        margin: auto 16px;
        border-radius: 8px;
        box-shadow: var(--box-shadow);

        > input {
            width: 160px;
            padding-inline: 8px;
            line-height: 28px;
        }

        > button {
            width: 48px;
            background: linear-gradient(to right, var(--color-theme), var(--color-theme-dark));
            color: white;
        }
    }

    @media (width < 1024px) {
        .header-search {
            display: none;
        }
    }
</style>