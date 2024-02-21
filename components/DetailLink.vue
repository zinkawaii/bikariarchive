<script setup>
    import jEntry from "~/dist/json/Entry.json";

    const props = defineProps(["title"]);

    const isArray = Array.isArray(props.title);

    //词条名称
    const name = computed(() => {
        return isArray ? props.title[0] : props.title;
    });

    //显示名称
    const displayName = computed(() => {
        return isArray ? props.title[1] : props.title;
    });

    //是否存在
    const isExist = computed(() => {
        return jEntry.all.includes(name.value);
    });
</script>

<template>
    <span class="detail-link">
        <coco-link :danger="!isExist" :to="toEntry(name)">{{ displayName }}</coco-link>
    </span>
</template>