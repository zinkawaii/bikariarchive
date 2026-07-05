<script lang="ts" setup>
  import type { SetupContext } from "vue";

  defineProps<{
    danger?: boolean;
    hideExternal?: boolean;
  }>();

  const attrs = useAttrs() as SetupContext["attrs"];

  const isExternal = computed(() => {
    return typeof attrs.to === "string" && /^(?:https?:)?\/\//.test(attrs.to);
  });

  const target = computed(() => {
    return isExternal.value ? "_blank" : attrs.target as string;
  });

  const rel = computed(() => {
    return isExternal.value ? "noopener noreferrer nofollow" : attrs.rel as string;
  });
</script>

<template>
  <nuxt-link
    class="plain-link"
    :class="{ [`is-danger`]: danger }"
    :target
    :rel
  >
    <slot></slot>
    <iconify
      v-if="isExternal && !hideExternal"
      class="plain-external"
      name="fa7-solid:arrow-up-right-from-square"
    />
  </nuxt-link>
</template>

<style scoped>
  .plain-link {
    color: var(--color-link);

    &.is-danger {
      color: var(--color-danger);
    }
  }

  .plain-external {
    margin-left: 2px;
    font-size: 1em;
    vertical-align: -2px;
  }
</style>
