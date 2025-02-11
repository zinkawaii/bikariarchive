import vue from "@vitejs/plugin-vue";
import { resolve } from "pathe";
import { ProxyAgent, setGlobalDispatcher } from "undici";
import robotsConfig from "./app/robots.config";
import { clientConfig, serverConfig } from "./app/runtime.config";
import sitemapConfig from "./app/sitemap.config";

try {
    const dispatcher = new ProxyAgent({ uri: new URL(process.env.HTTPS_PROXY!).toString() });
    setGlobalDispatcher(dispatcher);
}
catch {}

export default defineNuxtConfig({
    app: {
        rootAttrs: {
            id: "z-root"
        }
    },
    alias: {
        "@bikari/article": resolve(import.meta.dirname, "./packages/article/src"),
        "@bikari/excalc": resolve(import.meta.dirname, "./packages/excalc"),
        "@bikari/shared": resolve(import.meta.dirname, "./packages/shared/src")
    },
    css: [
        "~/assets/scss/var.scss",
        "~/assets/scss/sinrabansyo.scss",
        "~/assets/scss/animation.scss"
    ],
    compatibilityDate: "2024-07-19",
    components: [
        {
            path: "~/components"
        },
        {
            path: "~/components/ui",
            prefix: "z"
        },
        {
            path: "~/components/shared",
            prefix: "mb"
        }
    ],
    devServer: {
        https: {
            key: "<!-- ??? -->",
            cert: "<!-- ??? -->"
        },
        host: clientConfig.domain,
        port: 443
    },
    devtools: {
        enabled: true
    },
    experimental: {
        viewTransition: true
    },
    features: {
        inlineStyles: false
    },
    future: {
        compatibilityVersion: 4
    },
    nitro: {
        rollupConfig: {
            // @ts-expect-error 类型实例化过深，且可能无限
            plugins: [
                vue()
            ]
        }
    },
    runtimeConfig: {
        ...serverConfig,
        public: clientConfig
    },
    vite: {
        build: {
            target: "esnext"
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: "modern-compiler",
                    additionalData: `@use "~/assets/scss/mixin.scss" as *;`
                }
            }
        },
        server: {
            allowedHosts: true
        }
    },
    modules: [
        ["@kikiutils/nuxt-session", serverConfig.session],
        ["nuxt-mongoose", serverConfig.mongoose],
        "@nuxt/fonts",
        "@nuxt/icon",
        "@nuxt/image",
        "@nuxtjs/seo",
        "@pinia/nuxt",
        "@vueuse/nuxt",
        "@zinkawaii/nuxt-shiki",
        "motion-v/nuxt",
        "pinia-plugin-persistedstate/nuxt"
    ],
    robots: robotsConfig,
    sitemap: sitemapConfig,
    site: {
        name: clientConfig.title,
        url: `https://${clientConfig.domain}`,
        description: clientConfig.description,
        defaultLocale: "zh-CN",
        indexable: true
    },
    fonts: {
        provider: "google",
        families: [{
            name: "Source Code Pro",
            global: true
        }]
    },
    splittedFonts: {
        fonts: [{
            name: "ChillRoundF",
            path: "~/assets/fonts/ChillRoundFRegular.ttf"
        }]
    },
    icon: {
        componentName: "iconify"
    },
    shiki: {
        dynamic: true,
        defaultTheme: {
            light: "catppuccin-latte",
            dark: "one-dark-pro"
        }
    }
});