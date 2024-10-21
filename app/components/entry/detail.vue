<script lang="ts" setup>
    import type { EntryDetail } from "@bikari/article";
    import { EntryKnownAbility, EntryStarredAbility } from "#components";

    defineOptions({
        components: {
            "known-ability": EntryKnownAbility,
            "starred-ability": EntryStarredAbility
        }
    });
    defineProps<EntryDetail>();
</script>

<template>
    <entry-section :title>
        <novel-article tag="div" :body="content" :components="$options.components"/>
    </entry-section>
</template>