<script lang="ts" setup>
  import type { TransitionProps } from "vue";
  import { easeInBack, easeOutBack } from "#build/easings";

  const props = withDefaults(defineProps<{
    scale?: number;
    duration?: number;
    ease?: [string, string];
  }>(), {
    scale: 0.66,
    duration: 400,
    ease: () => [easeOutBack, easeInBack],
  });

  const onEnter: TransitionProps["onEnter"] = async (el, done) => {
    const animation = el.animate([
      { opacity: 0, scale: props.scale },
      { opacity: 1, scale: 1 },
    ], {
      duration: props.duration,
      easing: props.ease[0],
    });
    animation.addEventListener("finish", done);
  };

  const onLeave: TransitionProps["onLeave"] = async (el, done) => {
    const animation = el.animate([
      { opacity: 1, scale: 1 },
      { opacity: 0, scale: props.scale },
    ], {
      duration: props.duration,
      easing: props.ease[1],
    });
    animation.addEventListener("finish", done);
  };
</script>

<template>
  <transition :css="false" @enter="onEnter" @leave="onLeave">
    <slot></slot>
  </transition>
</template>
