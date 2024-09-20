<script lang="ts" setup>
    const props = defineProps<{
        title: string | [name: string, displayName: string];
    }>();

    //词条与显示名称
    const titles = computed(() => {
        return Array.isArray(props.title) ? props.title : [props.title, props.title];
    });

    //是否存在
    const isExist = computed(() => {
        return Entry.meta.all.includes(titles.value[0]);
    });
</script>

<template>
    <span class="entry-link">
        <plain-link :danger="!isExist" :to="toEntry(titles[0])">{{ titles[1] }}</plain-link>
    </span>
</template>