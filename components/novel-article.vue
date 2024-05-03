<script lang="ts">
    import { MbCode, MbGallery, MbImage, NuxtImg, PlainLink } from "#components";

    export default {
        components: {
            MbCode,
            MbGallery,
            MbImage,
            NuxtImg,
            PlainLink
        },
        props: {
            content: {
                type: String,
                default: ""
            },
            enabled: {
                type: Boolean,
                default: true
            },
            tag: {
                type: String,
                default: "article"
            }
        },
        render() {
            const { content, enabled, tag } = this;
            return enabled ? h({
                template: `<${tag}>${content}</${tag}>`,
                components: this.$options.components
            }) : h(tag, {
                innerHTML: content
            });
        }
    };
</script>