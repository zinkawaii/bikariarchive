<script lang="ts" setup>
    import type { EntryDetail } from "@bikari/article";
    import { LazyEntryKnownAbility, LazyEntryStarredAbility } from "#components";

    defineOptions({
        components: {
            LazyEntryKnownAbility,
            LazyEntryStarredAbility,
        },
    });
    defineProps<EntryDetail>();
</script>

<template>
    <entry-section :title>
        <novel-article as="div" :body="content" :components="$options.components"/>
    </entry-section>
</template>
