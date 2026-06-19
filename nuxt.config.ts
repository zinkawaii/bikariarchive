import vue from "@vitejs/plugin-vue";
import { resolve } from "pathe";
import robotsConfig from "./app/robots.config";
import { clientConfig, serverConfig } from "./app/runtime.config";
import typescriptConfig from "./app/typescript.config";

export default defineNuxtConfig({
  app: {
    rootAttrs: {
      id: "z-root",
    },
  },
  css: [
    "~/assets/scss/var.scss",
    "~/assets/scss/sinrabansyo.scss",
    "~/assets/scss/animation.scss",
  ],
  alias: {
    "@bikari/article": resolve(import.meta.dirname, "packages/article/src"),
  },
  compatibilityDate: "2024-07-19",
  components: [
    {
      path: "~/components",
    },
    {
      path: "~/components/ui",
      prefix: "z",
    },
    {
      path: "~/components/shared",
      prefix: "mb",
    },
  ],
  devServer: {
    port: 4615,
  },
  devtools: {
    enabled: true,
  },
  experimental: {
    typedPages: true,
    typescriptPlugin: true,
  },
  future: {
    compatibilityVersion: 5,
  },
  nitro: {
    rolldownConfig: {
      plugins: [
        vue(),
      ],
    },
    typescript: {
      tsConfig: typescriptConfig.serverTsConfig,
    },
  },
  runtimeConfig: {
    ...serverConfig,
    public: clientConfig,
  },
  typescript: typescriptConfig,
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "~/assets/scss/mixin.scss" as *;`,
        },
      },
    },
    server: {
      allowedHosts: true,
      watch: {
        ignored: [
          "!**/.data/**",
        ],
      },
    },
  },
  modules: [
    "@bikariya/image-viewer",
    "@bikariya/modals",
    "@bikariya/shiki",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/seo",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "motion-v/nuxt",
    "pinia-plugin-persistedstate/nuxt",
  ],
  fonts: {
    provider: "google",
  },
  icon: {
    componentName: "iconify",
  },
  image: {
    provider: "none",
  },
  ogImage: {
    enabled: false,
  },
  robots: robotsConfig,
  site: {
    name: clientConfig.title,
    url: `https://${clientConfig.domain}`,
    description: clientConfig.description,
    defaultLocale: "zh-CN",
    indexable: true,
  },
  sitemap: {
    excludeAppSources: true,
    sources: [
      "/api/sitemap",
    ],
  },
});
