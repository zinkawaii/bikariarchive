<script lang="ts" setup>
  import type { Bangumi } from "#build/bangumi";

  defineProps<Bangumi>();
</script>

<template>
  <nuxt-link class="bangumi-item" :to="`https://bangumi.tv/subject/${id}`" target="_blank">
    <div class="bangumi-cover">
      <nuxt-img v-if="cover" class="bangumi-image" :src="cover" alt="[cover]" loading="lazy"/>
    </div>
    <div class="bangumi-info">
      <h3 class="bangumi-title text-truncate">{{ title.ja }}</h3>
      <span class="bangumi-trans text-truncate">{{ title.zh }}</span>
      <ul class="bangumi-tags">
        <li class="bangumi-tag">
          <iconify name="fa7-solid:circle-play"/>
          <time>{{ date }}</time>
        </li>
      </ul>
    </div>
  </nuxt-link>
</template>

<style scoped>
  .bangumi-item {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
  }

  .bangumi-cover {
    overflow: hidden;
    aspect-ratio: 1 / 1.414;
    background-color: var(--color-gray-900);
  }

  .bangumi-image {
    height: 100%;
    object-fit: cover;
  }

  .bangumi-info {
    display: grid;
    gap: 4px;
    position: absolute;
    inset: auto 0 0;
    margin-block: auto;
    padding: 32px 12px 8px;
    background-image: linear-gradient(to bottom, transparent, rgb(0 0 0 / 75%) 50%);
  }

  .bangumi-title {
    transition: all 0.25s;
  }

  .bangumi-trans {
    font-size: 14px;
    color: var(--color-info);
  }

  .bangumi-tags {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: var(--color-info);
  }

  .bangumi-tag {
    display: contents;
  }
</style>
