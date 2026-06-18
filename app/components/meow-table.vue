<script lang="ts" setup>
  withDefaults(defineProps<{
    variant?: "table" | "div";
    minWidth?: number;
  }>(), {
    variant: "table",
    minWidth: 616,
  });
</script>

<template>
  <div class="meow-table" :class="`is-${variant}`">
    <table v-if="variant === `table`" :style="{ minWidth: `${minWidth}px` }">
      <slot></slot>
    </table>
    <slot v-else></slot>
  </div>
</template>

<style lang="scss" scoped>
  .meow-table {
    border: 1px solid var(--color-border);
    line-height: 1.6;

    &.is-table {
      overflow: auto;

      > table {
        width: 100%;
        border-spacing: 2px;
      }
    }

    &.is-div {
      display: flex;
      gap: 2px;
      padding: 2px;
    }

    :deep() {
      :where(th, dt) {
        padding: 3px 12px;
        background-color: var(--color-theme);
        font-family: var(--font-smooth);
        font-size: var(--font-size-th);
        text-align: center;
      }

      :where(td, dd) {
        padding: 3px 6px;
        font-size: var(--font-size-td);
      }

      > dl {
        display: grid;
        flex: 1;
        grid-template-columns: var(--dt-fr, 1fr) var(--dd-fr, 1fr);
        row-gap: 2px;
      }
    }
  }
</style>
