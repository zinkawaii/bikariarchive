<script lang="ts" setup>
    defineProps<{
        title?: string;
    }>();
</script>

<template>
    <section class="entry-section">
        <h2 v-if="title" :id="title">{{ title }}</h2>
        <slot>
            <p>未知。</p>
        </slot>
    </section>
</template>
