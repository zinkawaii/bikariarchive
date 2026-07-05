<script lang="ts" setup>
  const settingStore = useSettingStore();
</script>

<template>
  <z-jumbotron />
  <z-background />
  <z-header />
  <z-toolbar />
  <div
    class="sotomi"
    :class="{
      [`wide-page`]: $route.meta.widePage,
      [`full-page`]: $route.meta.fullPage,
    }"
  >
    <main class="nakami">
      <slot></slot>
      <comment-area v-if="$route.meta.comment" v-show="settingStore.get(`interaction`)"/>
      <z-footer />
    </main>
    <z-aside v-show="$route.meta.aside ?? true">
      <slot name="aside"></slot>
    </z-aside>
  </div>
  <bikariya-modals />
  <toast-area />
  <z-fps />
  <z-context-menu />
</template>

<style>
  .sotomi {
    --sotomi-padding: 32px;

    display: flex;
    justify-content: center;
    gap: 24px;
    min-width: var(--size-min-width);
    min-height: calc(100svh - 64px);
    padding: var(--sotomi-padding);

    @media (width < 1024px) {
      --sotomi-padding: 12px;

      flex-direction: column;
    }

    @media (width < 596px) {
      --sotomi-padding: 0px;
    }
  }

  .wide-page {
    > .nakami {
      max-width: 1308px;
    }

    > .z-aside {
      display: none;
    }
  }

  .full-page {
    --sotomi-padding: 0px;

    > .nakami {
      max-width: none;
    }

    .z-footer, > .z-aside {
      display: none;
    }
  }

  .nakami {
    --meow-large: 2rem;
    --meow-medium: 1.5rem;

    container: main / inline-size;
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 24px;
    max-width: 1028px;
    z-index: 1;

    @media (width < 1024px) {
      --meow-large: 1.5rem;

      gap: 16px;
    }

    @media (width < 596px) {
      gap: 0;
    }

    @media (width < 425px) {
      --meow-large: 1rem;
      --meow-medium: 1rem;
    }
  }

  .bikariya-overlay {
    position: fixed;
    opacity: 0.5;
    inset: 0;
    background-color: black;

    &:where(.v-enter-active, .v-leave-active) {
      transition: opacity 0.4s;
    }

    &.v-enter-active {
      transition-timing-function: var(--ease-out-cubic);
    }

    &.v-leave-active {
      transition-timing-function: var(--ease-in-cubic);
    }

    &:where(.v-enter-from, .v-leave-to) {
      opacity: 0;
    }
  }

  .z-background {
    z-index: -1;
  }

  .z-aside {
    z-index: 32;
  }

  .z-jumbotron, .z-header, .z-toolbar {
    z-index: 64;
  }

  .toast-area, .z-fps {
    z-index: 768;
  }

  .z-context-menu {
    z-index: 1024;
  }
</style>
