<script setup>
    const config = useRuntimeConfig();
    useHead({
        title: "主页",
        link: { rel: "canonical", href: `https://${config.public.domain}` }
    });

    const profileLinks = [
        {
            title: "Github",
            to: "https://github.com/KazariEX",
            icon: "fab fa-github"
        },
        {
            title: "Twitter",
            to: "https://twitter.com/KazariEX_0929",
            icon: "fab fa-twitter"
        },
        {
            title: "BiliBili",
            to: "https://space.bilibili.com/37810541",
            icon: "fab fa-bilibili"
        },
        {
            title: "RSS",
            to: "/feed",
            icon: "rss"
        }
    ];
</script>

<template>
    <client-only>
        <teleport to=".jumbotron-wrapper">
            <home-jumbotron />
        </teleport>
    </client-only>
    <coco-widget class="home-brief">
        <div class="content-table home-welcome">
            <p>
                <i class="home-qrcode"></i>
                <span class="content-h2">欢迎来到微光茶馆！</span><br />
                这里是我的个人网站，主要用于发布小说正文，所有文章均可在<coco-link :to="{ name: `catalogue` }">目录页</coco-link>索引并浏览。<coco-link :to="{ name: `details` }">情报页</coco-link>整理并展示了目前部分可以公开的设定。<coco-link :to="{ name: `search` }">检索页</coco-link>可在全文范围内对特定关键词进行检索。
            </p>
        </div>
        <home-introduction />
        <div class="content-table">
            <a class="profile-avatar">
                <nuxt-img :src="$config.public.avatar"/>
            </a>
            <table class="profile-table">
                <tbody>
                    <tr>
                        <th width="40%">作者</th>
                        <td>{{ $config.public.author }}</td>
                    </tr>
                    <tr>
                        <th>个人群</th>
                        <td><coco-link to="https://jq.qq.com/?_wv=1027&k=ezy4Y5TS" target="_blank">836164664</coco-link></td>
                    </tr>
                    <tr>
                        <th>读者群</th>
                        <td><coco-link to="https://jq.qq.com/?_wv=1027&k=pCxzWpRr" target="_blank">743284714</coco-link></td>
                    </tr>
                </tbody>
            </table>
            <ul class="profile-link">
                <li v-for="{ title, to, icon } in profileLinks">
                    <nuxt-link :to="to" :title="title" target="_blank">
                        <fa-icon :icon="icon"/>
                    </nuxt-link>
                </li>
            </ul>
        </div>
    </coco-widget>
    <div class="home-complex">
        <home-update />
        <home-calendar />
        <home-blank />
    </div>
    <home-tool-container />
</template>

<style lang="scss" scoped>
    .home-qrcode {
        float: right;
        width: 74px;
        height: 74px;
        margin-left: 4px;
        background-color: var(--color-theme-dark);
        mask-image: url("/garden/qrcode-site.svg");
        mask-size: cover;
    }

    .home-brief {
        display: grid;
        grid-template:
            "A A"
            "B C" / 1fr 40%;
        gap: var(--cw-gap);
    }

    .home-welcome {
        grid-area: A;
    }

    .profile-table {
        border-spacing: 8px;
        font-size: 16px;
        text-align: center;

        td {
            border-bottom: 1px solid var(--color-border-light);
        }
    }

    .profile-avatar {
        display: block;
        width: min(80%, 256px);
        aspect-ratio: 1;
        margin: -32px auto 8px;
        border-radius: 100%;
        filter: drop-shadow(4px 12px 8px rgb(0 0 0 / 24%));

        &:hover {
            > img {
                animation: profile-avatar-jump 0.4s ease;
            }
        }

        > img {
            border-radius: inherit;
        }

        @keyframes profile-avatar-jump {
            50% {
                transform: rotateY(90deg) translateY(-32px);
            }
        }
    }

    .profile-link {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding-inline: 8px;

        a {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border: 1px solid var(--color-border-light);
            border-radius: 4px;
            font-size: 16px;
            color: var(--color-theme-dark);
        }
    }

    .home-complex {
        display: grid;
        grid-gap: 16px;
        grid-template:
            "A B" auto
            "A C" 1fr / auto 1fr;
    }

    @container main (width < 768px) {
        .home-brief {
            grid-template: "A" "B" "C";
        }
    }

    @container main (width < 596px) {
        .home-complex {
            grid-template: "A" "B" "C";
        }
    }
</style>