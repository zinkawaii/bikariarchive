<script lang="ts" setup>

</script>

<template>
    <div class="content-table home-welcome">
        <p>
            <i class="welcome-qrcode"></i>
            <span class="content-h2 welcome-title">欢迎来到{{ $config.public.title }}！</span><br />
            这里是我的个人网站，主要用于发布小说正文，所有文章均可在<plain-link :to="{ name: `catalogue` }">目录页</plain-link>索引并浏览。<plain-link :to="{ name: `details` }">情报页</plain-link>整理并展示了目前部分可以公开的设定。<plain-link :to="{ name: `search` }">检索页</plain-link>可在全文范围内对特定关键词进行检索。
        </p>
    </div>
</template>

<style lang="scss" scoped>
    .home-welcome {
        grid-area: A;
    }

    .welcome-qrcode {
        float: right;
        width: 76px;
        aspect-ratio: 1;
        margin-left: 4px;
        background-color: var(--color-theme-dark);
        mask-image: url("/garden/qrcode-site.svg");
        mask-size: cover;
    }

    .welcome-title {
        line-height: 30px;
    }
</style>