<script lang="ts" setup>
  defineProps<{
    content: string;
    path: string;
  }>();
</script>

<template>
  <p>{{ content }}</p>
  <p>https://archive.bikari.top{{ path }}</p>
</template>
