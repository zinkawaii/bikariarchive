<script lang="ts" setup>
  withDefaults(defineProps<{
    light?: string;
    dark?: string;
  }>(), {
    light: "center",
    dark: "center",
  });
</script>

<template>
  <div class="profile-backdrop"></div>
</template>

<style lang="scss" scoped>
  .profile-backdrop {
    background-image: url("/api/image/outerworld.webp");
    background-position: center v-bind("light");
    background-size: cover;
    mask-image: linear-gradient(to bottom, white, transparent);

    @include dark {
      background-image: url("/garden/illustration/utakata_1.webp");
      background-position: center v-bind("dark");
    }
  }
</style>
