import { clientConfig, serverConfig } from "./app/runtime.config";
import sitemapConfig from "./app/sitemap.config";
import robotsConfig from "./app/robots.config";

export default defineNuxtConfig({
    app: {
        head: {
            charset: "utf-8",
            viewport: "width=device-width, initial-scale=1",
            link: [
                { rel: "icon", href: "/garden/favicon.ico" },
                { rel: "alternate", type: "application/atom+xml", title: clientConfig.title, href: "/feed" }
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
        "~/assets/scss/sinrabansyo.scss"
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
        "nuxt-icon",
        "nuxt-site-config",
        "@nuxt/image",
        "@nuxtjs/google-fonts",
        "@nuxtjs/seo",
        "@pinia/nuxt",
        "@pinia-plugin-persistedstate/nuxt",
        "@vue-email/nuxt",
        "@vueuse/nuxt",
        "@zinkawaii/nuxt-gsap",
        "@zinkawaii/nuxt-shiki"
    ],
    site: {
        name: clientConfig.title,
        url: `https://${clientConfig.domain}`,
        description: clientConfig.description,
        defaultLocale: "zh-CN",
        indexable: true
    },
    googleFonts: {
        display: "swap",
        families: {
            "Source Code Pro": {
                regular: 400
            }
        }
    },
    splittedFonts: {
        fonts: [{
            name: "Teng Xiang",
            path: "./assets/fonts/TengXQJianYuan-w3.ttf"
        }]
    },
    shiki: {
        dynamic: true,
        defaultTheme: {
            light: "min-light",
            dark: "one-dark-pro"
        }
    },
    gsap: {
        plugins: [
            "Flip"
        ]
    }
});