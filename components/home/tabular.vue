<script lang="ts" setup>
    const { page, total, jLimited } = useArticleList({
        type: "blog",
        sticky: true
    });
</script>

<template>
    <home-tabular-item v-for="art in jLimited" :art="art"/>
    <div class="content-widget home-pagination">
        <mb-pagination :total scroll-target=".home-article-item" v-model="page"/>
    </div>
</template>

<style lang="scss" scoped>
    .home-pagination {
        padding-block: 16px;
        border-block: none;
    }
</style>