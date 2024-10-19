<script lang="ts" setup>
    import type { ArticleCover } from "@bikari/article";

    const props = withDefaults(defineProps<Partial<ArticleCover>>(), {
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
    <figure ref="root" class="novel-cover">
        <nuxt-img
            v-if="src"
            class="novel-image"
            :class="`is-${align}`"
            :src
            alt="[cover]"
            loading="lazy"
        />
    </figure>
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
            background-color: var(--color-info-light-5);
            font-size: 48px;
            font-weight: bold;
        }
    }

    .novel-image {
        position: absolute;
        height: 100%;
        object-fit: cover;

        &.is-top {
            object-position: top;
        }

        &.is-bottom {
            object-position: bottom;
        }
    }
</style>