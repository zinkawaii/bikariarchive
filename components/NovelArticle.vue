<script>
    import { CocoLink, MbCode, MbGallery, MbImage, NuxtImg } from "#components";

    export default {
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
        components: {
            CocoLink,
            MbCode,
            MbGallery,
            MbImage,
            NuxtImg
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