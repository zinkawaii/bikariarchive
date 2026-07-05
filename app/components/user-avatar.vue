<!-- @inferTemplateDollarAttrs false -->

<script lang="ts" setup>
  const attrs = useAttrs();

  const srcset = computed(() => {
    return attrs.src ? `${attrs.src}&s=128 1x, ${attrs.src}&s=256 2x` : void 0;
  });
</script>

<template>
  <nuxt-img
    class="user-avatar"
    :srcset
    placeholder="/garden/icon/default.png"
    alt="[avatar]"
  />
</template>

<style scoped>
  .user-avatar {
    aspect-ratio: 1;
    border-radius: var(--rounded-full);
    box-shadow: var(--box-shadow);
  }
</style>
