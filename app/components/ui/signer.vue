<script lang="ts" setup>
  const signerStore = useSignerStore();
  const route = useRoute();

  // 路径变更时收起
  watch(() => route.path, () => {
    signerStore.close();
  });
</script>

<template>
  <mb-dialog class="z-signer" @close="signerStore.close()">
    <div class="signer-innerworld"></div>
    <transition mode="out-in">
      <signer-profile v-if="signerStore.isAdmin"/>
      <signer-in v-else/>
    </transition>
  </mb-dialog>
</template>

<style scoped>
  .z-signer {
    --dialog-padding: 0;

    width: 640px;
    background-color: var(--color-background-alpha);
    backdrop-filter: blur(4px);
    font-size: 14px;

    @media (width < 425px) {
      height: 100dvh;
      border-radius: 0;
    }
  }

  .signer-innerworld {
    height: 372px;
    box-shadow: var(--box-shadow);
    background-image: url("/api/image/outerworld.webp");
    background-position: center 15%;
    background-size: cover;
    mask-image: linear-gradient(to var(--direction, right), white, transparent);

    [z-dark] & {
      background-image: url("/api/image/innerworld.webp");
    }

    @media (width >= 425px) {
      width: 75%;
    }

    @media (width < 425px) {
      --direction: bottom;

      height: 75%;
    }
  }

  :deep(.meow-input) {
    margin-top: 22px;
  }
</style>
