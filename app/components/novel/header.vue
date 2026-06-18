<script lang="ts" setup>
  defineProps<{
    art: Article;
    count?: number;
  }>();
</script>

<template>
  <novel-cover v-if="art.cover" v-bind="art.cover" viewable/>
  <header class="novel-header">
    <h1 class="novel-title">{{ art.title }}</h1>
    <novel-attributes
      :art
      :count
      :attrs="[`read-count`, `word-count`, `publish-date`, `update-date`]"
    />
    <nuxt-link v-if="art.prev" class="novel-adjacent is-prev" :to="art.prev?.route">
      <iconify name="fa7-solid:chevron-left"/>
      <span>{{ art.isFirstInVol ? "上一卷" : "上一章" }}</span>
    </nuxt-link>
    <nuxt-link v-if="art.next" class="novel-adjacent is-next" :to="art.next?.route">
      <iconify name="fa7-solid:chevron-right"/>
      <span>{{ art.isLastInVol ? "下一卷" : "下一章" }}</span>
    </nuxt-link>
  </header>
</template>

<style lang="scss" scoped>
  .novel-cover {
    height: 288px;
    margin: calc(-1 * var(--meow-large) + 8px);
    margin-bottom: 16px;
    border-radius: 8px;
    box-shadow: var(--box-shadow);
  }

  .novel-header {
    display: grid;
    grid-template:
      "C A D"
      "C B D" / 1fr auto 1fr;
    row-gap: 8px;
    margin-bottom: 24px;
  }

  .novel-title {
    grid-area: A;
    font-size: 24px;
    text-align: center;
  }

  .novel-attributes {
    grid-area: B;
  }

  .novel-adjacent {
    display: flex;
    align-items: center;
    margin-inline-end: auto;
    color: var(--color-theme-text);

    &.is-prev {
      grid-area: C;
    }

    &.is-next {
      grid-area: D;
      direction: rtl;
    }

    @include viewport("md") {
      font-size: 0;
    }

    > .iconify {
      font-size: 42px;
    }
  }
</style>
