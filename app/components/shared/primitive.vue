<script lang="ts" setup>
  export interface MbPrimitiveProps {
    as?: keyof HTMLElementTagNameMap;
  }

  withDefaults(defineProps<MbPrimitiveProps>(), {
    as: "div",
  });
</script>

<template>
  <component :is="as">
    <slot></slot>
  </component>
</template>
