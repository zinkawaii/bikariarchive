<script lang="ts" setup>
  import { easeInBack, easeOutBack } from "#build/easings";

  const settingStore = useSettingStore();
  const signerStore = useSignerStore();

  const collapse = computed(() => settingStore.get("ui-collapse"));

  onMounted(() => {
    if (window.innerWidth < Zin.MAX_WINDOW_SIZE) {
      settingStore.set("ui-collapse", true);
    }

    const popperEls = [...document.querySelectorAll(".z-toolbar > .mb-popper")].slice(0, -1);

    watchEffect(() => {
      const sortedEls = collapse.value ? popperEls : popperEls.toReversed();

      for (let i = 0; i < sortedEls.length; i++) {
        sortedEls[i].animate({
          translate: `${collapse.value ? 64 : 0}px`,
        }, {
          duration: 400,
          delay: 50 * i,
          easing: collapse.value ? easeInBack : easeOutBack,
          fill: "forwards",
        });
      }
    });
  });
</script>

<template>
  <menu class="z-toolbar">
    <mb-popper as="li" direction="left" plaintext="开往">
      <nuxt-link class="tool-item" to="https://www.travellings.cn/go.html">
        <iconify name="fa7-solid:train-subway"/>
      </nuxt-link>
    </mb-popper>
    <mb-popper as="li" direction="left" plaintext="设置">
      <button class="tool-item" @click="settingStore.open()">
        <iconify name="fa7-solid:gear"/>
      </button>
    </mb-popper>
    <mb-popper as="li" direction="left" plaintext="用户">
      <button class="tool-item" @click="signerStore.open()">
        <iconify name="fa7-solid:user"/>
      </button>
    </mb-popper>
    <mb-popper as="li" direction="left" plaintext="回到顶部">
      <a class="tool-item" href="#">
        <span class="tool-progress"></span>
        <iconify class="tool-arrow-top" name="fa7-solid:arrow-up"/>
      </a>
    </mb-popper>
    <mb-popper as="li" direction="left" :plaintext="collapse ? `展开` : `收起`">
      <button class="tool-item" @click="settingStore.toggle(`ui-collapse`)">
        <iconify :name="`fa7-solid:chevron-${collapse ? `left` : `right`}`"/>
      </button>
    </mb-popper>
  </menu>
</template>

<style scoped>
  .z-toolbar {
    display: grid;
    gap: 8px;
    position: fixed;
    right: 24px;
    bottom: 32px;
    pointer-events: none;
  }

  .tool-item {
    display: grid;
    place-items: center;
    position: relative;
    width: 36px;
    aspect-ratio: 1;
    border-radius: 6px;
    box-shadow: var(--box-shadow);
    background-color: var(--color-theme-dark);
    color: white;
    pointer-events: auto;

    &:hover {
      background-color: var(--color-info);
    }
  }

  @property --scroll-progress {
    syntax: "<integer>";
    initial-value: 0;
    inherits: false;
  }

  .tool-progress, .tool-arrow-top {
    position: absolute;
    opacity: var(--opacity0);
    inset: 0;
    margin: auto;
    animation: scroll-progress linear;
    animation-timeline: scroll();
  }

  .tool-progress {
    --opacity1: 1;
    --opacity0: 0;

    font-family: var(--font-smooth);
    font-size: 14px;
    line-height: 36px;
    text-align: center;
    counter-reset: scroll-progress var(--scroll-progress);

    &::before {
      content: counter(scroll-progress);
    }

    &::after {
      content: "%";
      padding-left: 1px;
      font-size: 12px;
    }

    :hover > & {
      --opacity1: 0;
    }
  }

  .tool-arrow-top {
    --opacity1: 0;
    --opacity0: 1;

    :hover > & {
      --opacity1: 1;
    }
  }

  @keyframes scroll-progress {
    0% {
      --scroll-progress: 0;

      opacity: var(--opacity1);
    }

    99.9999999% {
      opacity: var(--opacity1);
    }

    100% {
      --scroll-progress: 99;
    }
  }
</style>
