<script lang="ts" setup>
    import { hyphenate } from "@vueuse/core";
    import type { Element, Root } from "@bikari/process";
    import { Iconify, MbCode, MbGallery, MbImage, PlainLink } from "#components";

    const props = withDefaults(defineProps<{
        body?: Root | Element[];
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

    function render() {
        const { body, tag } = props;
        const children = Array.isArray(body) ? body : body.children;
        return h(tag, children.length ? r(children) : slots.default?.());

        function r(children: Element["children"]) {
            return children.map((node) => {
                if (node.type === "element") {
                    const comp = resolvedComponents.value[node.tag] || node.tag;
                    return h(comp, node.props, node.tag in resolvedComponents.value ? {
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