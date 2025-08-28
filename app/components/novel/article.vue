<script lang="ts">
    import { hyphenate } from "@vueuse/core";
    import type { ArticleVariant, Child, Element, Root } from "@bikari/article";
    import type { VNodeChild } from "vue";
    import { CommentCode, Iconify, MbCode, MbGallery, MbImage, MbMath, PlainLink, StoryHeading } from "#components";

    const ariaRE = /^aria[A-Z]/;

    const globalComponents = {
        CommentCode,
        Iconify,
        MbCode,
        MbGallery,
        MbImage,
        MbMath,
        PlainLink,
        StoryHeading,
    };
</script>

<script lang="ts" setup>
    const props = withDefaults(defineProps<{
        body?: Root | Child[];
        components?: Record<string, Component>;
        variant?: ArticleVariant;
        size?: "small" | "medium" | "large";
    }>(), {
        body: () => [],
        components: () => ({}),
        variant: "general",
    });
    const slots = defineSlots<{
        default: () => any;
    }>();

    const settingStore = useSettingStore();

    const fontSize = computed(() => {
        return props.size ?? {
            0: "small",
            1: "medium",
            2: "large",
        }[["article", "story"].includes(props.variant) ? settingStore.get("font-size") : 1];
    });

    const resolvedComponents = computed(() => {
        const comps: Record<string, Component> = {
            ...globalComponents,
            ...props.components,
        };
        for (const name in comps) {
            comps[hyphenate(name)] = comps[name];
        }
        return comps;
    });

    function transform(node: Element, variant?: ArticleVariant) {
        let { tag, children } = node;
        const props = { ...node.props };

        if (variant === "story") {
            if (tag === "h2") {
                tag = "story-heading";
                const last = children.at(-1);
                if (last?.type === "text") {
                    const [left, right] = last.value.split(" | ");
                    children = children.with(-1, { type: "text", value: left });
                    props.modifier = right;
                    delete props.id;
                }
            }
        }
        else if (variant === "comment") {
            if (tag === "mb-code") {
                tag = "comment-code";
            }
        }
        const comp = resolvedComponents.value[tag];

        if ("className" in props) {
            props.class = props.className;
            delete props.className;
        }

        for (const key in props) {
            if (ariaRE.test(key)) {
                props["aria-" + key.slice("aria".length).toLowerCase()] = props[key];
                delete props[key];
            }
            else if (!comp) {
                const hyphenated = hyphenate(key);
                if (hyphenated !== key) {
                    props[hyphenated] = props[key];
                    delete props[key];
                }
            }
        }

        return {
            tag,
            comp,
            props,
            children,
        };
    }

    function render() {
        const { body, variant } = props;
        const children = Array.isArray(body) ? body : body.children;
        return children.length ? children.map(r) : slots.default?.();

        function r(node: Child): VNodeChild {
            if (node.type === "element") {
                const { tag, comp, props, children } = transform(node, variant);
                return comp
                    ? h(comp, props, { default: () => children.map(r) })
                    : h(tag, props, children.map(r));
            }
            else {
                return node.value;
            }
        }
    }
</script>

<template>
    <mb-primitive class="novel-text" :class="`is-${variant} is-${fontSize}`" as="article">
        <render />
    </mb-primitive>
</template>

<style lang="scss">
    .novel-text {
        overflow-wrap: anywhere;

        @each $key, $size in (small, 14px), (large, 18px) {
            &.is-#{$key} {
                font-size: $size;
            }
        }

        :where(h2, h3, h4, h5, h6) {
            margin-block: 1.4em 0.7em;
        }

        > p {
            text-indent: 2em;
        }

        blockquote {
            margin-block: 1em;
            padding: 1em;
            border-block: 1px solid var(--color-border-lighter);
            border-inline: 4px solid var(--color-theme);
            background-color: var(--color-background);
            font-size: 14px;
        }

        :where(ol, ul) {
            margin-block: 1em;
            padding-left: 2em;
            list-style-type: revert;

            > li {
                margin-block: 0.2em;

                &::marker {
                    color: var(--color-theme-text);
                }
            }

            :is(ol, ul) {
                margin-block: 0;
            }
        }

        del {
            filter: blur(0.25em);
        }

        em {
            color: var(--color-theme-text);
        }

        strong {
            font-weight: bold;
        }

        :where(.mb-code, .mb-gallery, .mb-image, .mb-math) {
            margin-block: 1em;
        }

        :target {
            scroll-margin-top: 80px;
        }

        .emoji {
            width: 1.25em;
            height: 1.25em;
            margin-inline: 2px;
            vertical-align: -0.25em;
        }

        > .footnotes {
            margin-top: 1em;
            font-size: 14px;
        }

        .footnote-ref {
            margin-inline: 2px;
            color: var(--color-theme-text);

            &::before {
                content: "[";
            }

            &::after {
                content: "]";
            }
        }

        .footnote-backref {
            color: var(--color-info);
            transition: color 0.25s;

            &:hover {
                color: var(--color-theme-text);
            }
        }

        &:where(.is-general) {
            p {
                line-height: 2;
            }
        }

        &:where(.is-article, .is-story, .is-comment) {
            line-height: 1.8;

            > p {
                margin-block: 0.8em;
            }
        }

        &:where(.is-article, .is-comment) {
            h2 {
                position: relative;
                padding-left: 16px;

                &::before {
                    content: "";
                    display: block;
                    position: absolute;
                    inset: 0;
                    width: 6px;
                    border-radius: 2px;
                    background-color: var(--color-theme-dark);
                }
            }
        }

        &:where(.is-story) {
            h3 {
                text-align: center;
            }
        }

        &:where(.is-comment) {
            margin-block: 0.5em;

            > p {
                margin-block: 0.5em;
                text-indent: 0;
            }

            :where(ol, ul) {
                margin-block: 0.5em;
                padding-left: 1em;
            }

            img {
                max-width: 411px;
            }
        }

        > :first-child {
            margin-top: 0;
        }

        > :last-child {
            margin-bottom: 0;
        }
    }
</style>
