<script lang="ts" setup>
  const route = useRoute();

  const height = computed<number>((prev = 0) => {
    return route.meta.jumbotron?.height ?? prev;
  });
  //立即求值，防止首屏进入时不记录初始值
  void height.value;

  const percent = ref(1);

  useAdoptedStyleSheet/* CSS */`
    .z-jumbotron {
      --jumbotron-percent: ${percent};
    }
  `;

  function onBeforeEnter() {
    percent.value = 1;
  }

  function onBeforeLeave() {
    const { scrollY, innerHeight } = window;
    const bannerHeight = innerHeight * height.value / 100;
    const marginTop = bannerHeight - scrollY;
    percent.value = marginTop > 0 ? Math.min(1, marginTop / bannerHeight) : 0;

    if (percent.value) {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  }

  //点击箭头
  function toBottom() {
    window.scrollTo({
      top: window.innerHeight * height.value,
    });
  }
</script>

<template>
  <transition @before-enter="onBeforeEnter" @before-leave="onBeforeLeave">
    <div v-if="$route.meta.jumbotron" class="z-jumbotron" :style="`--height: ${height}svh`">
      <nuxt-img
        class="jumbotron-image"
        :src="$route.meta.jumbotron.image"
        alt="[jumbotron]"
        fetchpriority="high"
      />
      <jumbotron-hero v-if="$route.meta.jumbotron.hero"/>
      <button class="jumbotron-skip" aria-label="跳转到主要内容" @click="toBottom">
        <iconify name="fa7-solid:chevron-down"/>
      </button>
    </div>
  </transition>
</template>

<style scoped>
  @property --jumbotron-percent {
    syntax: "<number>";
    inherits: true;
    initial-value: 1;
  }

  .z-jumbotron {
    position: relative;
    height: var(--height);
    margin-bottom: calc(var(--height) * (var(--jumbotron-percent) - 1));
    mask-image: linear-gradient(black calc(100% * var(--jumbotron-percent)), transparent 0);

    &:where(.v-enter-active, .v-leave-active) {
      transition: --jumbotron-percent 0.4s;
    }

    &:where(.v-enter-from, .v-leave-to) {
      --jumbotron-percent: 0;
    }
  }

  .jumbotron-image {
    display: block;
    position: sticky;
    top: 0;
    height: 100%;
    margin-bottom: -100%;
    object-fit: cover;
  }

  .jumbotron-skip {
    display: flex;
    position: absolute;
    opacity: 0;
    inset: calc(100% - 14svh) 0 0;
    background-image: linear-gradient(transparent, black);
    font-size: 64px;
    color: white;
    transition: opacity 0.4s;

    &:hover {
      opacity: 0.5;
    }

    > .iconify {
      margin: auto;
    }
  }
</style>
