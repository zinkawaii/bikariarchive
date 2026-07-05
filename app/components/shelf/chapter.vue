<script lang="ts" setup>
  const props = defineProps<{
    art: Article;
  }>();

  const shelfStore = useShelfStore();
  const readRecordStore = useReadRecordStore();
  const { novel } = storeToRefs(shelfStore);

  const tags = [
    {
      name: "草稿",
      color: "rgb(216 108 234)",
      when: () => props.art.draft,
    },
    {
      name: "最近阅读",
      color: "var(--color-warning)",
      when: () => props.art.index === readRecordStore.get(novel.value)?.index,
    },
  ];
</script>

<template>
  <li class="shelf-chapter">
    <nuxt-link class="chapter-link" :to="art.route">
      <span class="chapter-title text-truncate">{{ art.title }}</span>
      <ul class="chapter-tags">
        <template v-for="{ name, color, when } in tags">
          <li
            v-if="toValue(when)"
            class="chapter-tag"
            :style="`--color: ${color}`"
          >{{ name }}</li>
        </template>
      </ul>
      <novel-attributes
        :art
        :attrs="[`word-count`, `publish-date`, `update-date`]"
        :wrap="false"
      />
    </nuxt-link>
  </li>
</template>

<style scoped>
  .chapter-link {
    display: grid;
    grid-template:
      "A B D" 26px
      "C C D" 24px / auto 1fr auto;
    align-items: center;
    column-gap: 8px;
    padding-top: 8px;
    border-bottom: 1px dashed var(--color-border-light);
    counter-increment: chapter-order;
    break-inside: avoid;

    &:hover {
      color: var(--color-theme-text);
    }

    &::after {
      content: counter(chapter-order);
      grid-area: D;
      opacity: 0.5;
      font-variant-numeric: tabular-nums;
      font-size: 28px;
      font-style: italic;
      font-weight: bold;
      color: var(--color-info);
    }
  }

  .chapter-tags {
    display: flex;
    align-items: center;
    gap: 0.5em;
    line-height: 1.5;
    text-wrap: nowrap;
  }

  .chapter-tag {
    padding-inline: 7px;
    border: 1px solid var(--color);
    border-radius: 4px;
    font-size: 13px;
    color: var(--color);
  }

  .novel-attributes {
    grid-area: C;
  }
</style>
