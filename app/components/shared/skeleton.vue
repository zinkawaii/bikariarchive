<script lang="ts" setup>
  withDefaults(defineProps<{
    rows?: number;
    animated?: boolean;
  }>(), {
    rows: 5,
    animated: true,
  });
</script>

<template>
  <div class="mb-skeleton" :class="{ [`is-animated`]: animated }">
    <div v-for="i in rows" :key="i" class="skeleton-item skeleton-paragraph"></div>
  </div>
</template>

<style lang="scss" scoped>
  .mb-skeleton {
    display: grid;
    gap: 16px;

    &.is-animated .skeleton-item {
      background-image: linear-gradient(to right, var(--color-gray-500) 25%, var(--color-gray-300) 37%, var(--color-gray-500) 63%);
      background-size: 400% 100%;
      animation: skeleton-loading 1.5s linear infinite;
    }
  }

  .skeleton-paragraph {
    opacity: 0.5;
    height: 16px;
    border-radius: 4px;
    background-color: var(--color-gray-500);

    &:first-child {
      width: 33%;
    }

    &:last-child {
      width: 66%;
    }
  }

  @keyframes skeleton-loading {
    from {
      background-position: 100% 50%;
    }

    to {
      background-position: 0 50%;
    }
  }
</style>
