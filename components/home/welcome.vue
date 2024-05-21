<script lang="ts" setup>
    import { renderSVG } from "uqr";

    const config = useRuntimeConfig();

    const qrcode = ref("");
    onMounted(() => {
        qrcode.value = renderSVG(`https://${config.public.domain}`, {
            border: 0,
            ecc: "M",
            whiteColor: "transparent",
            blackColor: "var(--color-theme-dark)"
        });
    });
</script>

<template>
    <div class="content-table home-welcome">
        <p>
            <span class="content-h2 welcome-title">欢迎来到{{ $config.public.title }}！</span>
            <i class="welcome-qrcode" v-html="qrcode"></i><br />
            这里是我的个人网站，主要用于发布小说正文，所有文章均可在<plain-link :to="{ name: `shelf` }">目录页</plain-link>索引并浏览。<plain-link :to="{ name: `details` }">情报页</plain-link>整理并展示了目前部分可以公开的设定。<plain-link :to="{ name: `search` }">检索页</plain-link>可在全文范围内对特定关键词进行检索。
        </p>
    </div>
</template>

<style lang="scss" scoped>
    $mt: 10px;

    .home-welcome {
        grid-area: A;
        padding-top: 16px - $mt;
    }

    .welcome-qrcode {
        display: flex;
        float: right;
        width: 76px;
        aspect-ratio: 1;
        margin: $mt 0 0 4px;
    }

    .welcome-title {
        display: inline-block;
        margin-block: $mt 2px;
    }
</style>