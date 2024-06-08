<script lang="ts" setup>
    useHead({
        title: "番剧"
    });

    const { pending, data } = useLazyFetch("/api/bangumi");

    const { page, total, sizes, filteredArr } = usePagination(() => {
        return data.value?.list ?? [];
    }, {
        sizes: 32
    });
</script>

<template>
    <coco-widget title="番剧">
        <mb-skeleton v-if="pending"/>
        <template v-else>
            <div class="bangumi-list">
                <bangumi-item v-for="bangumi in filteredArr" :key="bangumi.id" v-bind="bangumi"/>
            </div>
            <mb-pagination :total :sizes scroll-target="body" v-model="page"/>
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