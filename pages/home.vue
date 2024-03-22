<script setup>
    const config = useRuntimeConfig();
    useHead({
        title: "主页",
        link: { rel: "canonical", href: `https://${config.public.domain}` }
    });
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
                <span class="content-h2">欢迎来到{{ $config.public.title }}！</span><br />
                这里是我的个人网站，主要用于发布小说正文，所有文章均可在<coco-link :to="{ name: `catalogue` }">目录页</coco-link>索引并浏览。<coco-link :to="{ name: `details` }">情报页</coco-link>整理并展示了目前部分可以公开的设定。<coco-link :to="{ name: `search` }">检索页</coco-link>可在全文范围内对特定关键词进行检索。
            </p>
        </div>
        <home-introduction />
        <home-profile />
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
        gap: var(--cw-medium);
    }

    .home-welcome {
        grid-area: A;
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