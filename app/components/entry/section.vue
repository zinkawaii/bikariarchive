<script lang="ts" setup>
    defineProps<{
        title?: string;
    }>();
</script>

<template>
    <section class="entry-section">
        <h2 v-if="title">{{ title }}</h2>
        <slot></slot>
    </section>
</template>