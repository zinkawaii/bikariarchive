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
        runtimeCompiler: true,
        defineModel: true
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
        ["nuxt-simple-sitemap", sitemapConfig],
        ["nuxt-simple-robots", robotsConfig],
        "nuxt-site-config",
        "@nuxt/image",
        "@nuxtseo/module",
        "@pinia/nuxt",
        "@pinia-plugin-persistedstate/nuxt",
        "@vueuse/nuxt"
    ],
    site: {
        name: "微光茶馆",
        url: `https://${clientConfig.domain}`,
        defaultLocale: "zh-CN",
        indexable: true
    }
});