<!-- @inferTemplateDollarSlots false -->

<template>
  <aside-widget class="aside-unified">
    <template v-for="slot, name in $slots" #[name]>
      <slot :name></slot>
    </template>
  </aside-widget>
</template>

<style scoped>
  .aside-unified {
    display: flex;
    flex-direction: column;
    overflow: auto;
    max-height: calc(100dvh - 96px);
    padding: 0;
  }

  :deep() {
    > .aside-title {
      margin: 16px 16px 4px;
    }

    .aside-limited {
      overflow: hidden scroll;
      padding: 0 7px 12px 12px;
      overscroll-behavior: contain;

      &::-webkit-scrollbar {
        width: 5px;
      }

      &::-webkit-scrollbar-thumb {
        border: 0;
        background-color: var(--color-theme);
      }
    }

    .aside-anchor {
      padding-block: 6px;
      border-radius: 8px;
      font-size: 14px;
      line-height: 18px;
    }
  }
</style>
