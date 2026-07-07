<script lang="ts" setup>
  import type { VideoHTMLAttributes } from "vue";

  const props = defineProps<{
    src: VideoHTMLAttributes["src"];
    maxWidth?: VideoHTMLAttributes["width"];
    maxHeight?: VideoHTMLAttributes["height"];
    poster?: VideoHTMLAttributes["poster"];
    caption?: string;
  }>();

  // 附加样式
  const style = computed(() => {
    return {
      maxWidth: props.maxWidth ? `${props.maxWidth}px` : void 0,
      maxHeight: props.maxHeight ? `${props.maxHeight}px` : void 0,
    };
  });
</script>

<template>
  <figure class="mb-video">
    <video :style :src :poster controls></video>
    <figcaption v-if="caption" class="video-caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
  .mb-video {
    display: grid;
    position: relative;
  }

  .video-caption {
    margin-top: 8px;
    font-size: 13px;
    line-height: 2;
    text-align: center;
    color: var(--color-text-secondary);
  }
</style>
