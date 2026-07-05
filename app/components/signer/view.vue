<script lang="ts" setup>
  defineProps<{
    title: string;
  }>();
</script>

<template>
  <div class="signer-view">
    <hgroup class="signer-header">
      <h2 class="signer-title">{{ title }}</h2>
      <p class="signer-subtitle">
        <slot name="subtitle"></slot>
      </p>
    </hgroup>
    <slot></slot>
  </div>
</template>

<style scoped>
  .signer-view {
    position: absolute;
    inset: auto 0 0 auto;
    width: 288px;
    padding: 32px;

    &:where(.v-enter-active, .v-leave-active) {
      transition: all 0.15s;
    }

    &:where(.v-enter-from, .v-leave-to) {
      opacity: 0;
    }
  }

  .signer-header {
    display: grid;
    justify-items: flex-end;
    padding-bottom: 8px;
  }

  .signer-title {
    position: relative;
    margin-bottom: 16px;
    font-size: 28px;

    &::after {
      content: "";
      position: absolute;
      right: 0;
      bottom: -8px;
      width: calc(100% + 6px);
      height: 3px;
      border-radius: 3px;
      background-color: var(--color-theme-dark);
    }
  }

  .signer-subtitle {
    font-size: 12px;
    line-height: 1.5;
    text-align: right;
    color: var(--color-gray-50);

    &:hover {
      color: var(--color-theme-text);
    }
  }
</style>
