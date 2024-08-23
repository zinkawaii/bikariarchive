<script lang="ts" setup>
    defineProps<{
        danger?: boolean;
    }>();

    const attrs = useAttrs();

    const isExternal = computed(() => {
        return typeof attrs.to === "string" && /^(?:https?:)?\/\//.test(attrs.to);
    });

    const target = computed(() => {
        return isExternal.value ? "_blank" : attrs.target as string;
    });

    const rel = computed(() => {
        return isExternal.value ? "noopener noreferrer nofollow" : attrs.rel as string;
    });
</script>

<template>
    <nuxt-link
        class="plain-link"
        :class="{ [`is-danger`]: danger }"
        :target
        :rel
        ><slot></slot>
    </nuxt-link>
</template>

<style lang="scss">
    .plain-link {
        color: var(--color-link);

        &.is-danger {
            color: var(--color-danger);
        }
    }
</style>