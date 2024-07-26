<script lang="ts" setup>
    import jEntry from "~~/dist/json/Entry.json";

    const props = defineProps<{
        title: string | string[];
    }>();

    //有无别名
    const isArray = Array.isArray(props.title);

    //词条名称
    const name = isArray ? props.title[0] : props.title;

    //显示名称
    const displayName = isArray ? props.title[1] : props.title;

    //是否存在
    const isExist = jEntry.all.includes(name);
</script>

<template>
    <span class="detail-link">
        <plain-link :danger="!isExist" :to="toEntry(name)">{{ displayName }}</plain-link>
    </span>
</template>