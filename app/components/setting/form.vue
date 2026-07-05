<script lang="ts" setup>
  defineProps<{
    title: string;
    desc?: string;
  }>();
</script>

<template>
  <div class="setting-form">
    <div>
      <span class="form-title">{{ title }}</span>
      <p class="form-desc">{{ desc }}</p>
    </div>
    <slot></slot>
  </div>
</template>

<style scoped>
  .setting-form {
    display: grid;
    grid-template-columns: 0.8fr 1fr;
    align-items: center;
    gap: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--color-border-lighter);
  }

  .form-title {
    line-height: 24px;
  }

  .form-desc {
    font-size: 12px;
    color: var(--color-info);
  }
</style>
