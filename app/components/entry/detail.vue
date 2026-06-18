<script lang="ts" setup>
  import type { EntryDetail } from "@bikari/article";
  import { LazyEntryKnownAbility, LazyEntryStarredAbility } from "#components";

  defineProps<EntryDetail>();

  const components = {
    LazyEntryKnownAbility,
    LazyEntryStarredAbility,
  };
</script>

<template>
  <entry-section :title>
    <novel-article as="div" :body="content" :components/>
  </entry-section>
</template>
