<script lang="ts" setup>
  defineProps<{
    title?: string;
  }>();
</script>

<template>
  <div class="meow-widget content-widget">
    <header v-if="title" class="meow-header">
      <h1 class="meow-title">{{ title }}</h1>
    </header>
    <slot></slot>
  </div>
</template>

<style scoped>
  .meow-widget {
    padding: var(--meow-large);
  }

  .meow-header {
    margin-block: calc(-1 * var(--meow-large) + 2px) var(--meow-medium);
    padding-top: var(--meow-medium);
  }

  .meow-title {
    text-align: center;
  }
</style>
