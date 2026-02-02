<script lang="ts" setup>
    import type { RouteLocationRaw } from "vue-router";
    import { NuxtLink } from "#components";
    import { totalYears } from "~~/.data/json/update.json";

    interface NavItem {
        title: string;
        icon: string;
        to?: MaybeRefOrGetter<RouteLocationRaw>;
        children?: NavItem[];
    }

    const breadcrumbStore = useBreadcrumbStore();
    const shelfStore = useShelfStore();
    const router = useRouter();
    const word = ref("");

    const navs: NavItem[] = [
        {
            title: "主页",
            icon: "fa7-solid:mug-saucer",
            to: { name: "home" },
        },
        {
            title: "目录",
            icon: "fa7-solid:book",
            to: computed(() => shelfStore.route),
        },
        {
            title: "情报",
            icon: "fa7-solid:sitemap",
            to: { name: "intel" },
        },
        {
            title: "档案",
            icon: "fa7-solid:box-archive",
            children: [
                {
                    title: "借物表",
                    icon: "fa7-solid:person-praying",
                    to: { name: "borrowing" },
                },
                {
                    title: "工具箱",
                    icon: "fa7-solid:screwdriver-wrench",
                    to: { name: "toolkit" },
                },
                {
                    title: "番剧",
                    icon: "ri:bilibili-fill",
                    to: { name: "bangumi" },
                },
            ],
        },
        {
            title: "营业",
            icon: "fa7-solid:dumpster",
            children: [
                {
                    title: "更新日志",
                    icon: "fa7-solid:clock-rotate-left",
                    to: { name: "update", params: { year: totalYears[0] } },
                },
                {
                    title: "站点协议",
                    icon: "fa7-solid:handshake",
                    to: { name: "compact" },
                },
                {
                    title: "关于",
                    icon: "fa7-solid:circle-info",
                    to: { name: "about" },
                },
            ],
        },
        {
            title: "链接",
            icon: "fa7-solid:link",
            children: [
                {
                    title: "友情链接",
                    icon: "fa7-solid:user-group",
                    to: { name: "friend" },
                },
            ],
        },
    ];

    function search() {
        router.push(toSearch(word.value));
        word.value = "";
    }
</script>

<template>
    <header class="z-header">
        <div class="header-logo">
            <nuxt-link class="logo-wrapper" :to="breadcrumbStore.route">
                <span class="logo-aside">Bikari</span>
                <span class="logo-center">A</span>
                <span class="logo-aside">rchive</span>
            </nuxt-link>
        </div>
        <nav class="header-nav">
            <button class="nav-expand">
                <iconify name="tabler:menu-deep"/>
            </button>
            <ul class="nav-list">
                <mb-popper v-for="{ title, icon, to, children } in navs" as="li">
                    <component :is="to ? NuxtLink : `button`" class="nav-link" :to>
                        <iconify :name="icon"/>
                        <span>{{ title }}</span>
                    </component>
                    <template v-if="children?.length" #floating>
                        <nuxt-link v-for="child in children" class="nav-pop" :to="toValue(child.to)">
                            <iconify :name="child.icon"/>
                            <span>{{ child.title }}</span>
                        </nuxt-link>
                    </template>
                </mb-popper>
            </ul>
        </nav>
        <form class="header-search" @submit.prevent="search">
            <input type="search" placeholder="输入关键词..." v-model="word"/>
            <button aria-label="全文检索">
                <iconify name="fa7-solid:magnifying-glass"/>
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
        background-image:
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

    $title: 298px;
    $nav: 60px;
    $count: 7;
    $padding: 16px * 2;
    $nav-full: $nav * $count;
    $max: $title + $nav-full + $padding;

    .header-logo {
        display: flex;
        padding-inline: 16px;

        @media (width >= #{$max}) {
            max-width: 456px;
        }
    }

    .logo-wrapper {
        display: flex;
        margin: auto;
        font-family: var(--font-smooth);
        font-size: 32px;
        text-shadow: 1px 1px 4px rgb(0 0 0 / 50%);
        color: white;

        &:hover {
            > .logo-aside {
                opacity: 0.88;
                color: rgb(224 224 224);
            }

            > .logo-center {
                translate: 0 -2px;
            }

            &::before, &::after {
                animation: logo-flap 0.25s infinite;
            }
        }

        &::before, &::after {
            margin-inline: 2px;
        }

        &::before {
            content: "ʚ";
            transform-origin: right;
        }

        &::after {
            content: "ɞ";
            transform-origin: left;
        }
    }

    @keyframes logo-flap {
        0% {
            rotate: 0;
        }

        50% {
            rotate: y 30deg;
        }
    }

    .logo-aside {
        transition: all 0.25s;
    }

    .logo-center {
        color: white;
        transition: all 0.25s;
    }

    .header-nav {
        margin-block: auto;
    }

    .nav-expand {
        $fs: 28px;
        $p: 6px;

        display: flex;
        margin-inline: -($fs + $p) (-$p);
        padding: $p;
        font-size: $fs;
        color: white;
        transition: all 0.25s;
        filter: drop-shadow(var(--text-shadow));

        @media (width >= #{$max}) {
            display: none;
        }
    }

    .nav-list {
        display: flex;
        justify-content: center;

        @media (width < #{$max}) {
            gap: 4px;
            position: absolute;
            inset: calc(100% - 12px) 0 0 auto;
            height: 56px;
            padding: 2px 12px 0;
            border-bottom: 2px solid var(--color-theme-dark);
            border-radius: var(--rounded-full);
            box-shadow: var(--box-shadow-darker);
            background-color: var(--color-background);
            transform-origin: top right;
            transition: all 0.25s;

            :not(:hover) > & {
                opacity: 0;
                scale: 0.66;
                pointer-events: none;
            }
        }
    }

    .nav-link {
        display: grid;
        justify-items: center;
        gap: 4px;
        width: $nav;

        @media (width >= #{$max}) {
            color: white;
            filter: drop-shadow(var(--text-shadow));
        }

        > .iconify {
            transition: translate 0.2s;
        }

        &:hover > .iconify {
            translate: 0 -4px;
        }
    }

    .nav-pop {
        display: grid;
        grid-template-columns: 16px 1fr;
        align-items: center;
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
    }

    .header-search {
        display: grid;
        grid-template-columns: 160px 48px;
        overflow: hidden;
        margin: auto 16px;
        border-radius: 8px;
        box-shadow: var(--box-shadow);
        background-color: var(--color-background);
        line-height: 28px;

        @include viewport("lg") {
            display: none;
        }

        > input {
            padding-inline: 8px;
        }

        > button {
            display: grid;
            place-items: center;
            background-image: linear-gradient(to right, var(--color-theme), var(--color-theme-dark));
            color: white;
        }
    }
</style>
