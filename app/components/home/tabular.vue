<script lang="ts" setup>
    const { page, total, articles } = useArticleList({
        type: "blog",
        sticky: true,
    });
</script>

<template>
    <home-tabular-item v-for="art in articles" :art/>
    <div class="home-pagination content-widget">
        <mb-pagination :total scroll-target=".tabular-item" v-model="page"/>
    </div>
</template>

<style lang="scss" scoped>
    .home-pagination {
        padding-block: 16px;
        border-block: none;
    }
</style>
