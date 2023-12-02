import { serverConfig, clientConfig } from "./server/zin.config";

export default defineNuxtConfig({
    app: {
        head: {
            charset: "utf-8",
            viewport: "width=device-width, initial-scale=1",
            link: [
                { rel: "icon", href: "/garden/favicon.ico" }
            ],
            meta: [
                { "http-equiv": "Cache-Control", content: "no-siteapp" },
                { "http-equiv": "X-UA-Compatible", content: "IE=edge, chrome=1" }
            ]
        }
    },
    components: [
        {
            path: "~/components"
        },
        {
            path: "~/components/ui",
            prefix: "z"
        },
        {
            path: "~/components/common",
            prefix: "mb"
        }
    ],
    css: [
        "~/assets/fontawesome/css/fontawesome.css",
        "~/assets/fontawesome/css/brands.css",
        "~/assets/fontawesome/css/solid.css",
        "~/assets/scss/sinrabansyo.scss"
    ],
    runtimeConfig: {
        ...serverConfig,
        public: clientConfig
    },
    devtools: {
        enabled: false
    },
    experimental: {
        inlineSSRStyles: false,
        viewTransition: true
    },
    vue: {
        runtimeCompiler: true
    },
    devServer: {
        https: {
            key: "<!-- ??? -->",
            cert: "<!-- ??? -->"
        },
        host: "<!-- ??? -->",
        port: 443
    },
    modules: [
        ["@kikiutils/nuxt-session", serverConfig.session],
        ["nuxt-mongoose", serverConfig.mongoose],
        "@nuxtjs/robots",
        "@nuxt/image",
        "@pinia/nuxt",
        "@pinia-plugin-persistedstate/nuxt",
        "@vueuse/nuxt"
    ],
    robots: {
        rules: [
            ...[
                "AhrefsBot",
                "AhrefsSiteAudit",
                "aiHitBot",
                "BLEXBot",
                "Barkrowler",
                "DnyzBot",
                "DotBot",
                "ExtLinksBot",
                "GPTBot",
                "Mail.Ru",
                "MegaIndex.ru",
                "MJ12bot",
                "Researchscan",
                "SemrushBot",
                "spbot",
                "Uptimebot",
                "ZoominfoBot"
            ].map((ua) => ({
                UserAgent: ua,
                Disallow: "/",
                BlankLine: true
            }))
        ]
    }
});