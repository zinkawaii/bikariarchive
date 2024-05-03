<script lang="ts" setup>
    defineProps<{
        danger?: boolean;
    }>();
</script>

<template>
    <nuxt-link class="plain-link" :class="{ [`is-danger`]: danger }"><slot></slot></nuxt-link>
</template>

<style lang="scss">
    .plain-link {
        color: var(--color-link);

        &.is-danger {
            color: var(--color-danger);
        }
    }
</style>