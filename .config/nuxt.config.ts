import { clientConfig, serverConfig } from "./runtime.config.ts";
import typescriptConfig from "./typescript.config.ts";

export default defineNuxtConfig({
  app: {
    rootAttrs: {
      id: "z-root",
    },
  },
  css: [
    "~/assets/styles/var.css",
    "~/assets/styles/sinrabansyo.css",
    "~/assets/styles/animation.css",
  ],
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
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "nuxt-auth-utils",
    "nuxt-schema-org",
    "nuxt-seo-utils",
    "nuxt-site-config",
  ],
  dxup: {
    features: {
      namedLayoutSlots: true,
    },
  },
  fonts: {
    provider: "google",
  },
  icon: {
    componentName: "iconify",
  },
  image: {
    provider: "none",
  },
  robots: {
    credits: false,
    blockAiBots: true,
    blockNonSeoBots: true,
  },
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
