<script lang="ts" setup>
    import type { ArticleCover } from "@bikari/article";

    const props = withDefaults(defineProps<Partial<ArticleCover> & {
        viewable?: boolean;
    }>(), {
        align: "center"
    });

    const contextMenuStore = useContextMenuStore();
    const rootEl = useTemplateRef("root");

    contextMenuStore.extra(rootEl, {
        title: "cover",
        shield: ["image"],
        when: () => !!props.reference,
        items: [
            {
                title: "前往图源",
                icon: "fa6-solid:arrow-up-right-from-square",
                action() {
                    window.open(props.reference, "_blank");
                }
            }
        ]
    });
</script>

<template>
    <div ref="root" class="novel-cover">
        <mb-image
            v-if="src"
            :src
            :align
            :viewable
            alt="[cover]"
            loading="lazy"
        />
    </div>
</template>

<style lang="scss" scoped>
    .novel-cover {
        display: grid;
        position: relative;
        overflow: hidden;

        &::before {
            content: "Cover.";
            display: grid;
            place-items: center;
            position: absolute;
            opacity: 0.33;
            inset: 0;
            background-color: var(--color-gray-500);
            font-size: 48px;
            font-weight: bold;
        }
    }
</style>