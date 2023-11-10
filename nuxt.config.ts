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
    modules: [
        ["h3-session/nuxt", {
            secret: "<!-- ??? -->",
            resave: true,
            saveUninitialized: true,
            cookie: {
                secure: true
            }
        }],
        ["nuxt-mongoose", {
            uri: process.env.MONGODB_URI,
            options: {
                dbName: process.env.MONGODB_DBNAME,
                user: process.env.MONGODB_USER,
                pass: process.env.MONGODB_PASS
            }
        }],
        "@nuxt/image",
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