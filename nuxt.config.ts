import vue from "@vitejs/plugin-vue";
import { ProxyAgent, setGlobalDispatcher } from "undici";
import robotsConfig from "./app/robots.config";
import { clientConfig, serverConfig } from "./app/runtime.config";
import typescriptConfig from "./app/typescript.config";

try {
    const dispatcher = new ProxyAgent({ uri: new URL(process.env.HTTPS_PROXY!).toString() });
    setGlobalDispatcher(dispatcher);
}
catch {}

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
        https: {
            key: "<!-- ??? -->",
            cert: "<!-- ??? -->",
        },
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
        ["@kikiutils/nuxt-session", serverConfig.session],
        "@nuxt/fonts",
        "@nuxt/icon",
        "@nuxt/image",
        "@nuxtjs/seo",
        "@pinia/nuxt",
        "@vueuse/nuxt",
        "pinia-plugin-persistedstate/nuxt",
    ],
    robots: robotsConfig,
    sitemap: {
        excludeAppSources: true,
        sources: [
            "/api/sitemap",
        ],
    },
    site: {
        name: clientConfig.title,
        url: `https://${clientConfig.domain}`,
        description: clientConfig.description,
        defaultLocale: "zh-CN",
        indexable: true,
    },
    ogImage: {
        enabled: false,
    },
    fonts: {
        provider: "google",
        families: [{
            name: "Source Code Pro",
            global: true,
        }],
    },
    splittedFonts: {
        fonts: [{
            name: "ChillRoundF",
            path: "~/assets/fonts/ChillRoundFRegular.ttf",
        }],
    },
    icon: {
        componentName: "iconify",
    },
    image: {
        provider: "none",
    },
});
