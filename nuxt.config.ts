import { serverConfig, clientConfig } from "./app/zin.config";
import sitemapConfig from "./app/sitemap.config";
import robotsConfig from "./app/robots.config";

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
            ],
            titleTemplate: "%s %separator %siteName",
            templateParams: {
                separator: "-"
            }
        },
        rootId: "z-root"
    },
    css: [
        "~/assets/scss/var.scss",
        "~/assets/scss/sinrabansyo.scss",
        "~/assets/scss/atom.scss"
    ],
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
    devServer: {
        https: {
            key: "<!-- ??? -->",
            cert: "<!-- ??? -->"
        },
        host: "<!-- ??? -->",
        port: 443
    },
    devtools: {
        enabled: false
    },
    experimental: {
        viewTransition: true
    },
    features: {
        inlineStyles: false
    },
    runtimeConfig: {
        ...serverConfig,
        public: clientConfig
    },
    vue: {
        runtimeCompiler: true
    },
    modules: [
        ["@kikiutils/nuxt-session", serverConfig.session],
        ["nuxt-mongoose", serverConfig.mongoose],
        ["nuxt-simple-robots", robotsConfig],
        ["@nuxtjs/sitemap", sitemapConfig],
        "nuxt-site-config",
        "@nuxt/image",
        "@nuxtjs/google-fonts",
        "@nuxtjs/seo",
        "@pinia/nuxt",
        "@pinia-plugin-persistedstate/nuxt",
        "@vesp/nuxt-fontawesome",
        "@vueuse/nuxt"
    ],
    site: {
        name: clientConfig.title,
        url: `https://${clientConfig.domain}`,
        defaultLocale: "zh-CN",
        indexable: true
    },
    googleFonts: {
        display: "swap",
        text: [...new Set(clientConfig.jumbotron.main + clientConfig.jumbotron.sub)].join(""),
        families: {
            "Noto+Serif+JP": {
                wght: 500
            }
        }
    },
    fontawesome: {
        component: "fa",
        icons: {
            brands: [
                "bilibili",
                "github",
                "twitter"
            ],
            regular: [
                "clock"
            ],
            solid: [
                "angles-down",
                "angles-up",
                "arrow-right",
                "arrow-up",
                "arrow-up-right-from-square",
                "bullhorn",
                "book-open",
                "box-archive",
                "chevron-down",
                "chevron-left",
                "chevron-right",
                "clock-rotate-left",
                "comment-dots",
                "eye",
                "gear",
                "house",
                "info-circle",
                "link",
                "moon",
                "mug-saucer",
                "paper-plane",
                "paste",
                "pen",
                "pen-to-square",
                "pencil",
                "person-praying",
                "quote-left",
                "quote-right",
                "rotate-right",
                "rss",
                "search",
                "sitemap",
                "subway",
                "sun",
                "trash-can",
                "torii-gate",
                "user",
                "xmark"
            ]
        }
    }
});