<script setup>
    useHead({
        title: "番剧"
    });

    const page = ref(1);
    const sizes = 32;

    const { pending, data } = useLazyFetch("/api/bangumi");

    const totalBangumis = computed(() => {
        return data.value?.list ?? [];
    });

    const displayBangumis = computed(() => {
        const start = (page.value - 1) * sizes;
        const end = start + sizes;
        return totalBangumis.value.slice(start, end);
    });
</script>

<template>
    <coco-widget title="番剧">
        <mb-skeleton v-if="pending"/>
        <template v-else>
            <div class="bangumi-list">
                <bangumi-item v-for="bangumi in displayBangumis" :key="bangumi.id" v-bind="bangumi"/>
            </div>
            <mb-pagination :total="totalBangumis.length" :sizes scroll-target="body" v-model="page"/>
        </template>
    </coco-widget>
</template>

<style lang="scss" scoped>
    .bangumi-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--cw-medium);
        margin-bottom: 16px;

        @media (width < 1024px) {
            grid-template-columns: 1fr;
        }
    }
</style>