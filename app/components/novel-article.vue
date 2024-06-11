<script lang="ts" setup>
    import { MbCode, MbGallery, MbImage, NuxtImg, PlainLink } from "#components";

    const props = withDefaults(defineProps<{
        content?: string;
        enabled?: boolean;
        tag?: string;
    }>(), {
        content: "",
        enabled: true,
        tag: "article"
    });

    const render = () => {
        const { content, enabled, tag } = props;
        return enabled ? h({
            template: `<${tag}>${content}</${tag}>`,
            components: {
                MbCode,
                MbGallery,
                MbImage,
                NuxtImg,
                PlainLink
            }
        }) : h(tag, {
            innerHTML: content
        });
    };
</script>

<template>
    <render />
</template>