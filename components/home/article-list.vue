<script lang="ts" setup>
    const { page, total, jLimited } = useArticleList({
        type: "blog",
        sticky: true
    });
</script>

<template>
    <home-article-item v-for="art in jLimited" :art="art"/>
    <div class="content-widget home-article-pagination">
        <mb-pagination :total scroll-target=".home-article-item" v-model="page"/>
    </div>
</template>

<style lang="scss" scoped>
    .home-article-pagination {
        padding-block: 16px;
        border-block: none;
    }
</style>