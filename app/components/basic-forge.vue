<script lang="ts" setup>
  import { encodeHTML } from "entities";
  import type { BundledLanguage } from "shiki";

  export interface BasicForgeProps {
    lang?: BundledLanguage;
    meta?: string;
    raw?: string;
  }

  const props = defineProps<Required<BasicForgeProps>>();

  const shikiStore = useShikiStore();

  const html = computedAsync(async () => {
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
  <figure>
    <slot :html/>
  </figure>
</template>

