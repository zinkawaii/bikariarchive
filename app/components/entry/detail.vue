<script lang="ts" setup>
    import type { Element, Text } from "@bikari/article";
    import { EntryKnownAbility, EntryStarredAbility } from "#components";

    defineOptions({
        components: {
            "known-ability": EntryKnownAbility,
            "starred-ability": EntryStarredAbility
        }
    });
    const props = defineProps<{
        detail: Element[];
    }>();

    const title = computed(() => {
        return props.detail[0]?.tag === "h2" ? (props.detail[0]?.children[0] as Text).value : "";
    });

    const body = computed(() => {
        return props.detail.slice(props.detail[0]?.tag === "h2" ? 1 : 0);
    });
</script>

<template>
    <entry-section :title>
        <novel-article tag="div" :body :components="$options.components"/>
    </entry-section>
</template>