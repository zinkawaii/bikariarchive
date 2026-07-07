<script lang="ts" setup>
  const config = useRuntimeConfig();

  const duration = 400;
  const titleDelay = 80;
  const summaryDelay = 15;
  const title = config.public.title;
  const subtitle = ref<string>("");
  const [isMotion, toggleMotion] = useToggle(true);

  // 标题动效
  onMounted(async () => {
    await Zin.delay(duration + titleDelay);
    await Zin.interval((i) => {
      const char = config.public.subtitle[i];
      subtitle.value += char;
    }, {
      duration: summaryDelay,
      times: config.public.subtitle.length,
    });
    await Zin.delay(duration);
    toggleMotion(false);
  });
</script>

<template>
  <hgroup class="jumbotron-hero">
    <h1 class="jumbotron-title">
      <template v-if="isMotion">
        <span
          v-for="(char, i) in title"
          class="jumbotron-char"
          :style="{ animationDelay: `${i * titleDelay}ms` }"
        >{{ char }}</span>
      </template>
      <template v-else>{{ title }}</template>
    </h1>
    <h2 class="jumbotron-subtitle">
      <template v-if="isMotion">
        <span v-for="char in subtitle" class="jumbotron-char">{{ char }}</span>
      </template>
      <template v-else>{{ subtitle }}</template>
    </h2>
  </hgroup>
</template>

<style scoped>
  .jumbotron-hero {
    display: grid;
    align-content: center;
    position: absolute;
    inset: 0;
    text-align: center;
    text-shadow: 0 0 12px rgb(0 0 0 / 66%);
    color: white;
    animation: jumbotron-parallax linear;
    animation-range: exit;
    animation-timeline: view();
  }

  @keyframes jumbotron-parallax {
    from {
      translate: 0 calc(36svh * (var(--jumbotron-percent) - 1));
    }

    to {
      translate: 0 36svh;
    }
  }

  .jumbotron-title {
    font-size: 72px;

    > .jumbotron-char:nth-child(2n + 1) {
      --translate-y: -3.5rem;
    }
  }

  .jumbotron-subtitle {
    height: 1lh;
    margin-bottom: 0.5em;
  }

  .jumbotron-char {
    display: inline flow-root;
    opacity: 0;
    animation: jumbotron-jumping 0.4s both;
    animation-timing-function: var(--ease-out-back);
  }

  @keyframes jumbotron-jumping {
    from {
      translate: 0 var(--translate-y, 3.5rem);
    }

    to {
      opacity: 1;
      translate: 0;
    }
  }
</style>
