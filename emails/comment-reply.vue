<script lang="ts" setup>
    defineProps<{
        content: string;
        path: string;
    }>();
</script>

<template>
    <p>{{ content }}</p>
    <p>https://bikari.top{{ path }}</p>
</template>