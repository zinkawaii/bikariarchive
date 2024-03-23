<script setup>
    defineProps(["content", "path"]);
</script>

<template>
    <p>{{ content }}</p>
    <p>https://bikari.top{{ path }}</p>
</template>