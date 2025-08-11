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
        "@bikari/article": resolve(import.meta.dirname, "./packages/article/src"),
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
        https: true,
        host: clientConfig.domain,
        port: 4615,
    },
    devtools: {
        enabled: true,
    },
    nitro: {
        rollupConfig: {
            plugins: [
                vue(),
            ],
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
        $server: {
            build: {
                rollupOptions: {
                    output: {
                        // https://github.com/nuxt/nuxt/issues/32175#issuecomment-2898200099
                        preserveModules: true,
                    },
                },
            },
        },
    },
    modules: [
        "@kikiutils/nuxt-session",
        "@nuxt/eslint",
        "@nuxt/fonts",
        "@nuxt/icon",
        "@nuxt/image",
        "@nuxtjs/seo",
        "@pinia/nuxt",
        "@vueuse/nuxt",
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
    nuxtSession: {
        maxAge: 86400 * 30,
        storage: {
            data: {
                driver: "cookie/header",
                options: {
                    key: process.env.NUXT_SESSION_KEY!,
                },
            },
        },
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
    splittedFonts: {
        fonts: [{
            name: "ChillRoundF",
            path: "~/assets/fonts/ChillRoundFRegular.ttf",
        }],
    },
});
