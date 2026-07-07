<script lang="ts" setup>
  const props = defineProps<{
    title: string | [name: string, displayName: string];
  }>();

  // 词条与显示名称
  const titles = computed(() => {
    return Array.isArray(props.title) ? props.title : [props.title, props.title];
  });

  // 是否存在且不为草稿
  const isExisted = computed(() => {
    const title = titles.value[0];
    return title in Entry.meta.entries && !Entry.meta.drafts.includes(title);
  });
</script>

<template>
  <span class="entry-link">
    <plain-link :danger="!isExisted" :to="toEntry(titles[0])">{{ titles[1] }}</plain-link>
  </span>
</template>
