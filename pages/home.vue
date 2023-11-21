<script setup>
    import jArticle from "~/dist/json/Article.json";

    useHead({
        title: "主页",
        link: { rel: "canonical", href: "https://bikariarchive.xyz" }
    });

    const author = {
        name: "山吹色御守",
        avatar: "/garden/avatar/tsumugi.webp"
    };

    const intro = ref({
        status: 0,
        novel: [...Object.keys(jArticle)],
        layer: ["outer", "inner"],
        translate: []
    });

    //表里互换
    function exchange() {
        intro.value.status ^= 1;

        //首位小说入队尾
        const novel = intro.value.novel.shift();
        intro.value.novel.push(novel);

        //交换层级
        const { status, layer } = intro.value;
        [layer[0], layer[1]] = [layer[1], layer[0]];

        //旋转动画
        Zin.setInterval((t) => {
            const angle = Math.PI / 4 - (t + 1) * (Math.PI / 24);
            const sin = 12 * Math.sqrt(2) * Math.sin(angle);
            const cos = 12 * Math.sqrt(2) * Math.cos(angle);
            intro.value.translate[status] = `${cos + 12}px ${sin + 12}px`;
            intro.value.translate[1 - status] = `${-cos + 12}px ${-sin + 12}px`;
        }, {
            duration: 6,
            times: 24
        });
    }
</script>

<template>
    <client-only>
        <teleport to=".jumbotron-wrapper">
            <z-jumbotron />
        </teleport>
    </client-only>
    <div class="content-page">
        <div class="content-group home-brief">
            <div class="content-table home-welcome">
                <p>
                    <i class="home-qrcode"></i>
                    <span class="content-h2">欢迎来到微光茶馆！</span><br>
                    这里是我（山吹色御守）的个人网站，主要用于发布小说正文，所有文章均可在<nuxt-link :to="{ name: `catalogue` }">目录页</nuxt-link>索引并浏览。<nuxt-link :to="{ name: `details` }">情报页</nuxt-link>整理并展示了目前部分可以公开的设定。<nuxt-link :to="{ name: `search` }">检索页</nuxt-link>可在全文范围内对特定关键词进行检索。
                </p>
            </div>
            <div class="home-introduction">
                <home-intro-card v-for="i in 2"
                    :style="{ translate: intro.translate[i - 1] }"
                    :layer="intro.layer[i - 1]"
                    :novel="intro.novel[intro.status ? 2 - i : i - 1]"
                    @exchange="exchange"
                />
            </div>
            <div class="content-table">
                <a class="profile-avatar">
                    <nuxt-img :src="author.avatar"/>
                </a>
                <table class="profile-table">
                    <tbody>
                        <tr>
                            <th width="40%">作者</th>
                            <td>{{ author.name }}</td>
                        </tr>
                        <tr>
                            <th>个人群</th>
                            <td><nuxt-link to="https://jq.qq.com/?_wv=1027&k=ezy4Y5TS" target="_blank">836164664</nuxt-link></td>
                        </tr>
                        <tr>
                            <th>读者群</th>
                            <td><nuxt-link to="https://jq.qq.com/?_wv=1027&k=pCxzWpRr" target="_blank">743284714</nuxt-link></td>
                        </tr>
                    </tbody>
                </table>
                <ul class="profile-link">
                    <li>
                        <nuxt-link to="https://github.com/KazariEX" title="Github" target="_blank">
                            <i class="fab fa-github"></i>
                        </nuxt-link>
                    </li>
                    <li>
                        <nuxt-link to="https://twitter.com/KazariEX_0929" title="Twitter" target="_blank">
                            <i class="fab fa-twitter"></i>
                        </nuxt-link>
                    </li>
                    <li>
                        <nuxt-link to="https://space.bilibili.com/37810541" title="BiliBili" target="_blank">
                            <i class="fab fa-bilibili"></i>
                        </nuxt-link>
                    </li>
                    <li>
                        <nuxt-link to="/feed" title="RSS">
                            <i class="fas fa-rss"></i>
                        </nuxt-link>
                    </li>
                </ul>
            </div>
        </div>
        <div class="home-complex">
            <home-update />
            <home-calendar />
            <home-blank />
        </div>
        <home-tool-container />
    </div>
</template>

<style lang="scss" scoped>
    .home-qrcode {
        float: right;
        width: 74px;
        height: 74px;
        margin-left: 8px;
        background-color: var(--color-theme-block-dark);
        mask-image: url("/garden/QRCode_Site.svg");
        mask-size: cover;
    }

    .home-brief {
        display: grid;
        gap: 32px;
        grid-template:
            "A A"
            "B C" / 1fr 40%;
    }

    .home-welcome {
        grid-area: A;
    }

    .home-introduction {
        position: relative;
    }

    .profile-table {
        font-size: 16px;
        text-align: center;
        border-spacing: 8px;

        td {
            border-bottom: 1px solid var(--color-border-light);
        }
    }

    .profile-avatar {
        display: block;
        width: 80%;
        max-width: 256px;
        aspect-ratio: 1;
        margin: auto;
        margin-bottom: -24px;
        border-radius: 100%;
        translate: 0 -32px;
        filter: drop-shadow(4px 12px 8px rgb(0 0 0 / 24%));

        &:hover {
            > img {
                animation: profile-avatar-jump 0.4s ease;
            }
        }

        > img {
            border-radius: inherit;
            transition: all 0.4s;
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
        padding: 0 8px;

        a {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border: 1px solid var(--color-border-light);
            border-radius: 4px;
            font-size: 16px;
            color: var(--color-theme-block-dark);
        }
    }

    .home-complex {
        display: grid;
        grid-gap: 16px;
        grid-template:
            "A B" auto
            "A C" 1fr / auto 1fr;

        > div {
            border: var(--border-theme-group);
            border-radius: 16px;
            box-shadow: var(--box-shadow);
            background-color: var(--color-background-alpha);
        }
    }

    @container main (width < 768px) {
        .home-brief {
            grid-template: "A" "B" "C";
        }

        .home-introduction {
            height: 328px;
        }
    }

    @container main (width < 596px) {
        .home-complex {
            grid-template:
                "A"
                "B"
                "C";
        }
    }
</style>