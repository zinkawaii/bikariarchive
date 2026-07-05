<script lang="ts" setup>
  import type { EntryIllustration } from "@bikari/article";

  const props = defineProps<{
    data: EntryIllustration[];
  }>();

  const items = computed(() => {
    return props.data.map((item) => item.title);
  });
</script>

<template>
  <mb-tab class="entry-illustration" :items>
    <template v-for="{ title, illustrator, src } in data" #[title]>
      <mb-image :src alt="[illustration]"/>
      <meow-table class="entry-illustrator" variant="div">
        <dl>
          <dt>画师</dt>
          <dd>{{ illustrator }}</dd>
        </dl>
      </meow-table>
    </template>
  </mb-tab>
</template>

<style scoped>
  .entry-illustration {
    width: min(336px, 100%);
    margin-inline: auto;
  }

  .entry-illustrator {
    --dt-fr: 0.6fr;

    margin-top: 8px;
    font-size: 14px;
    text-align: center;
  }
</style>
