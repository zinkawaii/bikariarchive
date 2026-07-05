<script lang="ts" setup>
  import type { JNovel } from "@bikari/article";

  const props = defineProps<JNovel<Article> & {
    novel: string | number;
  }>();

  const shelfStore = useShelfStore();

  const isCurrentNovel = computed(() => {
    return props.novel === shelfStore.novel;
  });

  const cover = computed(() => {
    return isCurrentNovel.value && shelfStore.volumeInfo.cover || props.cover;
  });
</script>

<template>
  <li class="shelf-novel">
    <nuxt-link
      :class="{ [`is-checked`]: isCurrentNovel }"
      :to="{ params: { novel, volume: 0 } }"
    >
      <div class="novel-cover">
        <mb-image
          v-if="cover"
          :src="cover"
          alt="[cover]"
          align="center"
          :viewable="isCurrentNovel"
          @click="isCurrentNovel && $event.preventDefault()"
        />
        <div v-else class="novel-placeholder">Cover.</div>
      </div>
      <span class="novel-title">{{ title }}</span>
    </nuxt-link>
  </li>
</template>

<style scoped>
  .shelf-novel {
    display: grid;
    margin-inline: 8px;
    text-align: center;
    color: var(--color-info);
  }

  .novel-cover {
    display: grid;
    width: 128px;
    aspect-ratio: 1 / 1.414;
    transform-origin: bottom;
    transition: all 0.4s;
    filter: drop-shadow(8px 8px 2px rgb(0 0 0 / 16%));

    :not(.is-checked) > & {
      opacity: 0.66;
      scale: 0.9;
    }
  }

  .novel-placeholder {
    display: grid;
    align-items: center;
    border: 4px dashed var(--color-border);
    border-radius: 8px;
    font-size: 32px;
    font-weight: bold;
  }

  .novel-title {
    line-height: 42px;

    .is-checked > & {
      color: var(--color-theme-text);
    }
  }
</style>
