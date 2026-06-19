<script lang="ts" setup>
  import { animate, stagger } from "motion-v";
  import type { TransitionProps } from "vue";

  const settingStore = useSettingStore();

  const isSmallWindow = useMediaQuery("(width < 1024px)");

  const isCollapsed = computed(() => {
    const collapse = settingStore.get("ui-collapse");
    const display = settingStore.get("sidebar-display");
    return !isSmallWindow.value && display ? Boolean(display - 1) : collapse;
  });

  watch(isCollapsed, async () => {
    const nakami = document.querySelector(".nakami")!;
    const start = getPosition(nakami);
    await nextTick();
    const end = getPosition(nakami);

    animate(nakami, {
      x: [start.left - end.left, 0],
      y: [start.top - end.top, 0],
    }, {
      duration: 0.4,
      ease: "backOut",
    });
  });

  const onEnterLeave: TransitionProps["onEnter"] = async (el, done) => {
    if (isSmallWindow.value) {
      const reversed = settingStore.get("ui-collapse");
      await animate(".aside-widget", reversed ? {
        opacity: [1, 0],
        y: [0, "4rem"],
      } : {
        opacity: [0, 1],
        y: ["4rem", 0],
      }, {
        duration: 0.4,
        delay: stagger(0.05, { from: reversed ? "last" : "first" }),
        ease: reversed ? "backIn" : "backOut",
      });
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
    <aside v-if="!isCollapsed" class="z-sidebar no-scrollbar" @click="onClick">
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
  .z-sidebar {
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
