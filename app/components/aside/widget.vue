<script lang="ts" setup>
  defineProps<{
    title?: string;
  }>();
</script>

<template>
  <section class="aside-widget content-widget">
    <h3 v-if="title" class="aside-title">
      <slot name="icon"></slot>
      <span>{{ title }}</span>
    </h3>
    <slot></slot>
  </section>
</template>

<style scoped>
  .aside-widget {
    margin-top: 16px;
    padding: 16px;
    border-block: none;
  }

  .aside-title {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }
</style>
