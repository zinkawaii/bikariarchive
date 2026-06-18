<script lang="ts" setup>
  import type { ContextMenuItem } from "~/types/context-menu";

  const props = defineProps<ContextMenuItem>();

  const icon = computed(() => toValue(props.icon));
  const checked = computed(() => toValue(props.checked));
  const disabled = computed(() => toValue(props.disabled));
</script>

<template>
  <li class="menu-item" :class="{ [`is-disabled`]: disabled }" @click="action">
    <iconify :name="icon ?? (checked ? `fa7-solid:check` : ``)"/>
    <span>{{ title }}</span>
    <iconify v-if="icon && checked" name="fa7-solid:check"/>
    <context-menu-group v-if="children" :items="children"/>
  </li>
</template>

<style lang="scss" scoped>
  .menu-item {
    display: grid;
    grid-template-columns: 16px 1fr 16px;
    align-items: center;
    gap: 6px;
    position: relative;
    height: 28px;
    padding-inline: 8px;
    border-radius: 8px;
    color: var(--color-text-primary);
    transition: all 0.25s;
    cursor: pointer;
    user-select: none;

    &:hover {
      background-color: var(--color-theme);
      color: white;
    }

    &.is-disabled {
      color: var(--color-text-disabled);
      pointer-events: none;
    }
  }
</style>
