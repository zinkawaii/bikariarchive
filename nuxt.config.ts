// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            charset: "utf-8",
            viewport: "width=device-width, initial-scale=1",
            link: [
                { rel: "icon", href: "/garden/favicon.ico" }
            ]
        }
    },
    css: [
        "~/assets/fontawesome/css/fontawesome.css",
        "~/assets/fontawesome/css/brands.css",
        "~/assets/fontawesome/css/solid.css",
        "~/assets/scss/sinrabansyo.scss"
    ],
    modules: [
        "@pinia/nuxt",
        "@pinia-plugin-persistedstate/nuxt"
    ],
    devtools: {
        enabled: false
    },
    experimental: {
        viewTransition: true
    },
    devServer: {
        https: {
            key: "<!-- ??? -->",
            cert: "<!-- ??? -->"
        },
        host: "<!-- ??? -->",
        port: 615
    }
});