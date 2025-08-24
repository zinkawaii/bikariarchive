<script lang="ts" setup>
    definePageMeta({
        redirect: { name: "user-manage-read-record" },
        identity: 9,
        middleware: ["auth"],
    });
</script>

<template>
    <nuxt-page />
</template>
