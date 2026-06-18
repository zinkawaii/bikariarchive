<script lang="ts" setup>
  const toastStore = useToastStore();

  const toastList = computed(() => {
    return [...toastStore.toasts].reverse();
  });
</script>

<template>
  <transition-group class="toast-area" tag="ul">
    <toast-item
      v-for="[name, { icon, message }] in toastList"
      :key="name"
      :name
      :icon
      :message
    />
  </transition-group>
</template>

<style lang="scss" scoped>
  .toast-area {
    display: grid;
    justify-items: center;
    position: fixed;
    inset: 80px 0 auto;
    pointer-events: none;
  }
</style>
