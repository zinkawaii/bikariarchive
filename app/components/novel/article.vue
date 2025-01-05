<script lang="ts" setup>
    import type { Child, Root } from "@bikari/article";
    import { Iconify, MbCode, MbGallery, MbImage, PlainLink } from "#components";

    const props = withDefaults(defineProps<{
        body?: Root | Child[];
        components?: Record<string, Component>;
        tag?: string;
    }>(), {
        body: () => [],
        components: () => ({}),
        tag: "article"
    });
    const slots = defineSlots<{
        default: () => any;
    }>();

    const globalComponents = {
        Iconify,
        MbCode,
        MbGallery,
        MbImage,
        PlainLink
    };

    const resolvedComponents = computed(() => {
        return createComponentsMap({
            ...globalComponents,
            ...props.components
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

    function render() {
        const { body, tag } = props;
        const children = Array.isArray(body) ? body : body.children;
        return h(tag, children.length ? r(children) : slots.default?.());

        function r(children: Child[]) {
            return children.map((node) => {
                if (node.type === "element") {
                    const comp = resolvedComponents.value[node.tag] || node.tag;
                    return h(comp, transformProps(node.props), node.tag in resolvedComponents.value ? {
                        default: () => r(node.children)
                    } : r(node.children));
                }
                else {
                    return node.value;
                }
            });
        }
    }
</script>

<template>
    <render class="novel-text"/>
</template>