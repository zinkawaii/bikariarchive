<script lang="ts" setup>
  import type { EntryDetail } from "@bikari/article";
  import { components } from "#build/article";

  defineProps<EntryDetail>();
</script>

<template>
  <entry-section :title>
    <novel-article as="div" :body="content" :components="components.entry"/>
  </entry-section>
</template>
