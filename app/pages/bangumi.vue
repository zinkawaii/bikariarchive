<script lang="ts" setup>
    useHead({
        title: "番剧",
    });

    definePageMeta({
        widePage: true,
    });

    const page = useRouteQuery("page", 1, {
        transform: Number,
    });

    const { status, data } = useLazyFetch("/api/bangumi", {
        query: {
            page,
        },
    });
</script>

<template>
    <meow-widget title="番剧">
        <mb-skeleton v-if="status !== `success`"/>
        <template v-else-if="data">
            <div class="bangumi-list">
                <bangumi-item v-for="bangumi in data.list" :key="bangumi.id" v-bind="bangumi"/>
            </div>
            <mb-pagination :total="data.total" :sizes="data.sizes" scroll-target="body" v-model="page"/>
        </template>
    </meow-widget>
</template>

<style lang="scss" scoped>
    .bangumi-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: var(--meow-medium);
        margin-bottom: 16px;
    }
</style>
