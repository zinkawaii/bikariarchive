<script lang="ts" setup>
    import type { ArticleVariant, Child, Element, Root } from "@bikari/article";
    import type { VNodeArrayChildren } from "vue";
    import { Iconify, MbCode, MbGallery, MbImage, MbMath, PlainLink, StoryHeading } from "#components";

    const props = withDefaults(defineProps<{
        body?: Root | Child[];
        components?: Record<string, Component>;
        variant?: ArticleVariant;
    }>(), {
        body: () => [],
        components: () => ({}),
        variant: "general",
    });
    const slots = defineSlots<{
        default: () => any;
    }>();

    const globalComponents = {
        Iconify,
        MbCode,
        MbGallery,
        MbImage,
        MbMath,
        PlainLink,
        StoryHeading,
    };

    const resolvedComponents = computed(() => {
        return createComponentsMap({
            ...globalComponents,
            ...props.components,
        });
    });

    function createComponentsMap(comps: Record<string, Component>) {
        for (const name in comps) {
            comps[hyphenate(name)] = comps[name];
        }
        return comps;
    }

    function transformProps(props: Record<string, any>) {
        if ("className" in props) {
            props.class = props.className;
            delete props.className;
        }
        return props;
    }

    function transformVariant(node: Element, variant?: ArticleVariant) {
        //避免直接修改原始节点
        let { tag, props, children } = node;

        if (variant === "story") {
            if (tag === "h2") {
                tag = "story-heading";
                const last = node.children.at(-1);
                if (last?.type === "text") {
                    const [left, right] = last.value.split(" | ");
                    props = {
                        ...props,
                        modifier: right,
                    };
                    delete props.id;
                    children = children.slice(0, -1);
                    children.push({ type: "text", value: left });
                }
            }
        }

        return {
            tag,
            comp: resolvedComponents.value[tag] || tag,
            props: transformProps(props),
            children,
        };
    }

    function render() {
        const { body, variant } = props;
        const children = Array.isArray(body) ? body : body.children;
        return children.length ? r(children) : slots.default?.();

        function r(children: Child[]): VNodeArrayChildren {
            return children.map((node) => {
                if (node.type === "element") {
                    const { tag, comp, props, children } = transformVariant(node, variant);
                    return h(comp, props, tag in resolvedComponents.value ? {
                        default: () => r(children),
                    } : r(children));
                }
                else {
                    return node.value;
                }
            });
        }
    }
</script>

<template>
    <mb-primitive class="novel-text" :class="`is-${variant}`" as="article">
        <render />
    </mb-primitive>
</template>

<style lang="scss">
    .novel-text {
        overflow-wrap: anywhere;

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
                    font-weight: bold;
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

            .shiki {
                display: grid;
                margin-block: 0.5em -0.5em;
                padding-top: 0.5em;
                font-family: var(--font-monospace);
                font-size: 14px;
                line-height: 20px;

                > ::-webkit-scrollbar {
                    display: none;
                }
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
