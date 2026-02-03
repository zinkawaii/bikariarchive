<script lang="ts" setup>
    import { renderSVG } from "uqr";

    const shelfStore = useShelfStore();
    const config = useRuntimeConfig();

    const qrcode = ref("");
    onMounted(() => {
        qrcode.value = renderSVG(`https://${config.public.domain}`, {
            border: 0,
            ecc: "M",
            whiteColor: "transparent",
            blackColor: "var(--color-theme-dark)",
        });
    });
</script>

<template>
    <div class="home-welcome content-table p-small">
        <h3 class="welcome-title">欢迎来到{{ $config.public.title }}！</h3>
        <i class="welcome-qrcode" v-html="qrcode"></i><br />
        这里是我的个人网站，主要用于发布小说正文，所有文章均可在<plain-link :to="shelfStore.route">目录页</plain-link>索引并浏览。<plain-link :to="{ name: `intel` }">情报页</plain-link>整理并展示了目前部分可以公开的设定。<plain-link :to="{ name: `search` }">检索页</plain-link>可在全文范围内对特定关键词进行检索。
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
        display: inline flow-root;
        margin-block: $mt 4px;
    }
</style>
