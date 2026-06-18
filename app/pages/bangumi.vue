<script lang="ts" setup>
  import { chunks, sizes, total } from "#build/bangumi";

  useHead({
    title: "番剧",
  });

  definePageMeta({
    widePage: true,
  });

  const page = useRouteQuery("page", 1, {
    transform: Number,
  });

  const { status, data } = useAsyncData(() => `bangumi:${page.value}`, () => chunks[page.value]());
</script>

<template>
  <meow-widget title="番剧">
    <mb-skeleton v-if="status !== `success`"/>
    <template v-else-if="data">
      <div class="bangumi-list">
        <bangumi-item v-for="bangumi in data" :key="bangumi.id" v-bind="bangumi"/>
      </div>
      <mb-pagination :total :sizes scroll-target="body" v-model="page"/>
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
