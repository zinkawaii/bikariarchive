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
            "coco-link": CocoLink,
            "mb-code": MbCode,
            "mb-gallery": MbGallery,
            "mb-image": MbImage,
            "nuxt-img": NuxtImg
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