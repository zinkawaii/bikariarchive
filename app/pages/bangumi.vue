<script lang="ts" setup>
    useHead({
        title: "番剧"
    });

    const { execute, status, data } = useLazyFetch("/api/bangumi", {
        immediate: false
    });

    const { page, total, sizes, filteredArr } = usePagination(() => {
        return data.value?.list ?? [];
    }, {
        sizes: 32
    });

    //仅在客户端请求
    onMounted(execute);
</script>

<template>
    <coco-widget title="番剧">
        <mb-skeleton v-if="status !== `success`"/>
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