<script lang="ts" setup>
  import type { BasicForgeProps } from "~/components/basic-forge.vue";

  const props = withDefaults(defineProps<BasicForgeProps>(), {
    lang: "js",
    meta: "",
    raw: "",
  });

  const [isCollapsed, toggleCollapsed] = useToggle(false);
  const [isExpanded, toggleExpanded] = useToggle(false);

  const actions = [
    {
      title: "复制",
      icon: "fa7-solid:paste",
      action() {
        copyText(props.raw, "代码已复制");
      },
    },
    {
      title: "折叠",
      icon: () => `fa7-solid:chevron-${isCollapsed.value ? `left` : `down`}`,
      action: () => toggleCollapsed(),
    },
  ];

  // 行数
  const lines = computed(() => {
    return props.raw.split("\n").length;
  });

  // 行号
  const lineStr = computed(() => {
    return Array.from({ length: lines.value }, (_, i) => i + 1).join("\n");
  });
</script>

<template>
  <basic-forge v-slot="{ html }" class="mb-forge" v-bind="props">
    <figcaption class="forge-header">
      <span class="text-uppercase">{{ lang }}</span>
      <button
        v-for="{ title, icon, action } in actions"
        class="forge-action"
        :aria-label="title"
        @click="action"
      >
        <iconify :name="toValue(icon)"/>
      </button>
    </figcaption>
    <div
      class="forge-area"
      :class="{
        [`is-collapsed`]: isCollapsed,
        [`is-expanded`]: isExpanded,
      }"
    >
      <pre class="forge-line">{{ lineStr }}</pre>
      <pre class="shiki edge-fades-x no-scrollbar" v-html="html"></pre>
      <button v-if="lines >= 10" class="forge-expand" @click="toggleExpanded()">
        <iconify :name="`fa7-solid:angles-${isExpanded ? `up` : `down`}`"/>
      </button>
    </div>
  </basic-forge>
</template>

<style scoped>
  .mb-forge {
    overflow: hidden;
    border: 1px solid var(--color-border-lighter);
    border-radius: 16px;
    background-color: var(--color-background);
  }

  .forge-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 4px;
    padding-inline: 12px;
    border-radius: 12px;
    background-color: var(--color-theme);
    font-family: var(--font-smooth);
    font-size: 1rem;
    line-height: 28px;
    color: var(--color-theme-text);
  }

  .forge-action {
    display: grid;
    place-items: center;
    width: 1rem;

    &:first-of-type {
      margin-left: auto;
    }
  }

  .forge-area {
    display: flex;
    position: relative;
    overflow: hidden;
    max-height: 196px;
    margin-top: -4px;
    font-family: var(--font-monospace);
    font-size: 14px;
    line-height: 20px;
    transition-property: max-height, margin;
    transition-duration: 0.25s;

    &.is-expanded {
      max-height: fit-content;

      > .shiki {
        padding-bottom: 2em;
      }
    }

    &.is-collapsed {
      max-height: 0;
      margin-bottom: 4px;
    }
  }

  .forge-line, .shiki {
    padding: 1ch;
  }

  .forge-line {
    margin-left: 1ch;
    text-align: right;
    color: var(--color-info);
    user-select: none;
  }

  .shiki {
    overflow-y: hidden;
  }

  .forge-expand {
    position: absolute;
    inset: auto 0 0;
    height: 2em;
    background-image: linear-gradient(to top, var(--color-background) 4px, transparent);

    > .iconify {
      animation: expand-flash 2s infinite;
    }
  }

  @keyframes expand-flash {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0.33;
    }
  }
</style>
