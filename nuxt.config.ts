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
        rootId: "z-root",
        viewTransition: true
    },
    css: [
        "@fortawesome/fontawesome-svg-core/styles.css",
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
    build: {
        transpile: [
            "@fortawesome/vue-fontawesome"
        ]
    },
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
        "@nuxtjs/google-fonts",
        "@nuxtjs/seo",
        "@pinia/nuxt",
        "@pinia-plugin-persistedstate/nuxt",
        "@vueuse/nuxt"
    ],
    site: {
        name: "微光档案",
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
    }
});