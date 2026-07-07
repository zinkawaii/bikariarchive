<script lang="ts" setup>
  import { encodeHTML } from "entities";
  import type { BundledLanguage } from "shiki";

  const props = withDefaults(defineProps<{
    lang?: BundledLanguage;
    meta?: string;
    raw?: string;
  }>(), {
    lang: "js",
    raw: "",
  });

  const shikiStore = useShikiStore();

  const [isCollapse, toggleCollapse] = useToggle(false);
  const [isExpand, toggleExpand] = useToggle(false);
  const codeEl = useTemplateRef("pre");

  const actions = [
    {
      title: "复制",
      icon: "fa7-solid:paste",
      action() {
        copyText(codeEl.value!.textContent!, "代码已复制");
      },
    },
    {
      title: "折叠",
      icon: () => `fa7-solid:chevron-${isCollapse.value ? `left` : `down`}`,
      action: () => toggleCollapse(),
    },
  ];

  // 代码
  const code = computedAsync(async () => {
    const { lang, meta, raw } = props;
    const shiki = await shikiStore.load();
    await shikiStore.loadLang(lang);

    return shiki.codeToHtml(raw, {
      ...shikiStore.options,
      lang,
      meta: { __raw: meta },
    });
  }, encodeHTML(props.raw), { lazy: true });

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
  <figure class="mb-forge">
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
        [`is-collapse`]: isCollapse,
        [`is-expand`]: isExpand,
      }"
    >
      <pre class="forge-line">{{ lineStr }}</pre>
      <pre ref="pre" class="shiki edge-fades-x no-scrollbar" v-html="code"></pre>
      <button v-if="lines >= 10" class="forge-expand" @click="toggleExpand()">
        <iconify :name="`fa7-solid:angles-${isExpand ? `up` : `down`}`"/>
      </button>
    </div>
  </figure>
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

    &.is-expand {
      max-height: fit-content;

      > .shiki {
        padding-bottom: 2em;
      }
    }

    &.is-collapse {
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
    display: grid;
    place-items: center;
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
