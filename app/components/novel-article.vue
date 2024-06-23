<script lang="ts" setup>
    import { MbCode, MbGallery, MbImage, PlainLink } from "#components";

    const props = withDefaults(defineProps<{
        content?: string;
        enabled?: boolean;
        tag?: string;
    }>(), {
        content: "",
        enabled: true,
        tag: "article"
    });

    function render() {
        const { content, enabled, tag } = props;
        return enabled ? h({
            template: `<${tag}>${content}</${tag}>`,
            components: {
                MbCode,
                MbGallery,
                MbImage,
                PlainLink
            }
        }) : h(tag, {
            innerHTML: content
        });
    }
</script>

<template>
    <render />
</template>