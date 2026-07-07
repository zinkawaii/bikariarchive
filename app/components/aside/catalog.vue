<script lang="ts" setup>
  const props = defineProps<{
    art: Article;
  }>();

  // 当前选中卷
  const currentVolume = ref<number>();
  watchEffect(() => {
    currentVolume.value = props.art.volume;
  });

  // 本卷章节
  const articles = computed(() => {
    return props.art.novelInfo.chapters.filter((art) => art.volume === currentVolume.value);
  });
</script>

<template>
  <aside-unified>
    <h3 class="catalog-volume">
      <select class="catalog-selector" v-model="currentVolume">
        <option v-for="{ title }, i in art.novelInfo.volumes" :value="i">{{ title }}</option>
      </select>
      <span class="catalog-underline"></span>
    </h3>
    <ul class="aside-limited">
      <li v-for="{ title, route } in articles" class="catalog-item">
        <nuxt-link class="aside-anchor text-truncate" :to="route">{{ title }}</nuxt-link>
      </li>
    </ul>
  </aside-unified>
</template>

<style scoped>
  .catalog-volume {
    display: grid;
    margin: 8px 16px;
  }

  .catalog-selector {
    padding-block: 8px;
    border-bottom: 1px solid var(--color-border);

    &:focus + .catalog-underline {
      scale: 1;
    }

    > option {
      font-family: var(--font-primary);
      font-size: 1rem;
    }
  }

  .catalog-underline {
    height: 1px;
    margin-top: -1px;
    background-color: var(--color-theme-dark);
    transform-origin: left;
    transition: all 0.4s;
    scale: 0 1;
  }

  .catalog-item {
    display: grid;

    & + & {
      margin-top: 4px;
    }
  }

  .aside-anchor {
    padding-left: 12px;

    &:hover {
      background-color: var(--color-gray-500);
      color: white;
    }

    &.router-link-active {
      background-color: var(--color-theme);
      color: white;
    }
  }
</style>
