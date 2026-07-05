<script lang="ts" setup>
  let count = 0;
  let time = 0;
  const displayValue = ref(60);

  useRafFn(({ delta }) => {
    count++;
    time += delta;
    if (time >= 1000) {
      time -= 1000;
      displayValue.value = count;
      count = 0;
    }
  });
</script>

<template>
  <span class="z-fps">{{ displayValue }}FPS</span>
</template>

<style scoped>
  .z-fps {
    position: fixed;
    top: 0;
    left: 2px;
    background-clip: text;
    background-image: linear-gradient(120deg, rgb(240 144 255), rgb(240 88 104));
    font-size: 12px;
    font-weight: bold;
    color: transparent;
  }
</style>
