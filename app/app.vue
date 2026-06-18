<script lang="ts" setup>
  import scriptDark from "~/scripts/dark?url";

  const settingStore = useSettingStore();
  const config = useRuntimeConfig();

  const dark = ref<boolean>();
  const theme = ref<string>();

  const mediaLoads = {
    media: "none",
    onload: `this.onload=null;this.media="all"`,
  };

  useHead({
    link: [
      { rel: "icon", href: config.public.favicon },
      { rel: "apple-touch-icon", href: config.public.favicon },
      { rel: "alternate", type: "application/atom+xml", title: config.public.title, href: "/feed" },
      { rel: "stylesheet", href: "https://esm.sh/katex/dist/katex.min.css", ...mediaLoads },
    ],
    script: [
      { src: scriptDark },
    ],
    meta: [
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: config.public.title },
    ],
    titleTemplate: "%s %separator %site.name",
    templateParams: {
      separator: "-",
    },
    htmlAttrs: {
      theme,
      "z-dark": dark,
    },
  });

  //主题颜色
  settingStore.listen("theme", (val) => {
    theme.value = val;
  });

  //夜间模式
  settingStore.listen("dark-mode", (val) => {
    dark.value = val;
  });
</script>

<template>
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>
</template>
