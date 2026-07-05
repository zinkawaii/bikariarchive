<script lang="ts" setup>
  import type { RouteLocationNormalizedLoaded } from "vue-router";

  definePageMeta({
    name: "shelf",
    path: ":novel().:volume()",
    scrollToTop(to: RouteLocationNormalizedLoaded<"shelf">, from) {
      return to.name !== from.name || to.params.novel !== from.params.novel;
    },
  });

  const shelfStore = useShelfStore();
  const { novel, novelInfo, volumeInfo, articles } = storeToRefs(shelfStore);

  useHead({
    title: () => `${volumeInfo.value.title} - ${novelInfo.value.title}`,
  });
</script>

<template>
  <div class="shelf-combine">
    <fieldset class="shelf-fieldset">
      <legend>{{ novelInfo.title }}</legend>
      <intro-content :novel/>
    </fieldset>
    <fieldset v-show="novelInfo.volumes.length" class="shelf-fieldset">
      <legend>卷册列表</legend>
      <shelf-volumes />
    </fieldset>
  </div>
  <fieldset v-show="articles.length" class="shelf-fieldset">
    <legend>章节列表</legend>
    <shelf-chapters />
  </fieldset>
</template>

<style scoped>
  .shelf-combine {
    display: grid;
    gap: 16px 36px;
    margin-block: 16px;

    @container main (width >= 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .shelf-fieldset {
    padding-top: 8px;
    border-top: 1px solid var(--color-border);

    > legend {
      margin-inline: auto;
      padding-inline: 8px;
      font-family: var(--font-smooth);
      font-size: 20px;
    }
  }
</style>
