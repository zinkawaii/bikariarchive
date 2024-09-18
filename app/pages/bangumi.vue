<script lang="ts" setup>
    useHead({
        title: "番剧"
    });

    const page = ref(1);

    const { data, status } = useLazyFetch("/api/bangumi", {
        query: {
            page
        }
    });
</script>

<template>
    <coco-widget title="番剧">
        <mb-skeleton v-if="status !== `success`"/>
        <template v-else>
            <div class="bangumi-list">
                <bangumi-item v-for="bangumi in data.list" :key="bangumi.id" v-bind="bangumi"/>
            </div>
            <mb-pagination :total="data.total" :sizes="data.sizes" scroll-target="body" v-model="page"/>
        </template>
    </coco-widget>
</template>

<style lang="scss" scoped>
    .bangumi-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--cw-medium);
        margin-bottom: 16px;

        @include viewport("lg") {
            grid-template-columns: 1fr;
        }
    }
</style>