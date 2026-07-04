<script lang="ts" setup>
  import { easeInBack, easeOutBack } from "easings-css";
  import type { TransitionProps } from "vue";

  const settingStore = useSettingStore();

  const isSmallWindow = useMediaQuery("(width < 1024px)");

  const isCollapsed = computed(() => {
    const collapse = settingStore.get("ui-collapse");
    const display = settingStore.get("aside-display");
    return !isSmallWindow.value && display ? Boolean(display - 1) : collapse;
  });

  watch(isCollapsed, async () => {
    const nakami = document.querySelector(".nakami")!;
    const start = getPosition(nakami);
    await nextTick();
    const end = getPosition(nakami);

    nakami.animate([
      { translate: `${start.left - end.left}px ${start.top - end.top}px` },
      { translate: "0" },
    ], {
      duration: 400,
      easing: easeOutBack,
    });
  });

  const onEnterLeave: TransitionProps["onEnter"] = async (el, done) => {
    if (isSmallWindow.value) {
      const widgetEls = el.querySelectorAll(".aside-widget");
      const reversed = settingStore.get("ui-collapse");
      const keyframes = [
        { opacity: 1, translate: "0" },
        { opacity: 0, translate: "0 4rem" },
      ];

      await Promise.all(
        Array.from(widgetEls, (el, i) => {
          return new Promise((resolve) => {
            const animation = el.animate(reversed ? keyframes : keyframes.toReversed(), {
              duration: 400,
              delay: 50 * (reversed ? widgetEls.length - 1 - i : i),
              easing: reversed ? easeInBack : easeOutBack,
              fill: "both",
            });
            animation.addEventListener("finish", resolve);
          });
        }),
      );
    }
    done();
  };

  function onClick(event: MouseEvent) {
    if (isSmallWindow.value && event.target === event.currentTarget) {
      settingStore.set("ui-collapse", true);
    }
  }
</script>

<template>
  <transition @enter="onEnterLeave" @leave="onEnterLeave">
    <aside v-if="!isCollapsed" class="z-aside no-scrollbar" @click="onClick">
      <aside-profile />
      <div class="aside-sticky">
        <slot></slot>
        <aside-statistics />
        <aside-widget title="最近更新">
          <template #icon>
            <iconify name="fa7-solid:clock-rotate-left"/>
          </template>
          <recent-article :sizes="5" sort-by="updated"/>
        </aside-widget>
      </div>
    </aside>
  </transition>
</template>

<style lang="scss" scoped>
  .z-aside {
    display: grid;
    grid-template-columns: 256px;
    place-content: start center;
    margin-top: -16px;

    @include viewport("lg") {
      position: fixed;
      overflow: auto;
      inset: 80px 0 0;
      padding-bottom: 16px;
      backdrop-filter: blur(4px);
      transition: all 0.4s;
      overscroll-behavior: contain;
    }
  }

  .aside-sticky {
    position: sticky;
    top: 64px;
  }
</style>
