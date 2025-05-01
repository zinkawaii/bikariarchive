<script lang="ts" setup>
    import type { EntryDetail } from "@bikari/article";
    import { LazyEntryKnownAbility, LazyEntryStarredAbility } from "#components";

    defineOptions({
        components: {
            "known-ability": LazyEntryKnownAbility,
            "starred-ability": LazyEntryStarredAbility,
        },
    });
    defineProps<EntryDetail>();
</script>

<template>
    <entry-section :title>
        <novel-article as="div" :body="content" :components="$options.components"/>
    </entry-section>
</template>
