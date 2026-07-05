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
</script>

<template>
  <figure class="shiki">
    ```{{ lang }}
    <pre class="edge-fades-x no-scrollbar" v-html="code"></pre>
    ```
  </figure>
</template>

<style scoped>
  .shiki {
    display: grid;
    margin-block: 0.5em -0.5em;
    padding-top: 0.5em;
    font-family: var(--font-monospace);
    font-size: 14px;
    line-height: 20px;
  }
</style>
