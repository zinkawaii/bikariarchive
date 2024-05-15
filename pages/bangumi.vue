<script setup>
    import jBangumi from "~/assets/json/Bangumi.json";

    useHead({
        title: "番剧"
    });

    const page = ref(1);
    const sizes = 32;

    const displayBangumis = computed(() => {
        const start = (page.value - 1) * sizes;
        const end = start + sizes;
        return jBangumi.slice(start, end);
    });
</script>

<template>
    <coco-widget title="番剧">
        <div class="bangumi-list">
            <bangumi-item v-for="data in displayBangumis" :key="data.id" v-bind="data"/>
        </div>
        <mb-pagination :total="jBangumi.length" :sizes scroll-target="body" v-model="page"/>
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