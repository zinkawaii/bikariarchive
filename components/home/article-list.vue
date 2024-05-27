<script lang="ts" setup>
    const { jFull, jLimited, page } = useArticleList({
        type: "blog",
        limit: 10
    });
</script>

<template>
    <home-article-item v-for="art in jLimited" :art="art"/>
    <div class="content-widget home-article-pagination">
        <mb-pagination :total="jFull.length" v-model="page"/>
    </div>
</template>

<style lang="scss" scoped>
    .home-article-pagination {
        padding-block: 16px;
        border-block: none;
    }
</style>