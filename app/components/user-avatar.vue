<script lang="ts" setup>
  const props = defineProps<{
    src?: string;
  }>();

  const srcset = computed(() => (
    props.src && !props.src?.startsWith("/")
      ? `${props.src}&s=128 1x, ${props.src}&s=256 2x`
      : void 0
  ));
</script>

<template>
  <placeholder-image src="/garden/icon/default.png">
    <img class="user-avatar" :srcset alt="[avatar]"/>
  </placeholder-image>
</template>

<style scoped>
  .user-avatar {
    aspect-ratio: 1;
    border-radius: var(--rounded-full);
    box-shadow: var(--box-shadow);
  }
</style>
