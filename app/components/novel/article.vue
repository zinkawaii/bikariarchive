<script lang="ts" setup>
    import { hyphenate } from "@vueuse/core";
    import type { Element, Root } from "@bikari/process";
    import { MbCode, MbGallery, MbImage, PlainLink } from "#components";

    const props = withDefaults(defineProps<{
        body?: Root | Element[];
        tag?: string;
    }>(), {
        body: () => [],
        tag: "article"
    });
    const slots = defineSlots<{
        default: () => any;
    }>();

    const components = createComponentsMap({
        MbCode,
        MbGallery,
        MbImage,
        PlainLink
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
                    const comp = components[node.tag] || node.tag;
                    return h(comp, node.props, node.tag in components ? {
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