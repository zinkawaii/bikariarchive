import defu from "defu";

type NodeEnv = "development" | "production";

const server = {
    global: {
        article: {
            key: "<!-- ??? -->",
        },
        comment: {
            "/tweet": {
                identity: 9,
            },
        },
        mail: {
            name: "微光档案",
            host: "smtp.qq.com",
            port: 465,
            user: "<!-- ??? -->",
            password: "<!-- ??? -->",
        },
        session: {
            maxAge: 86400 * 30,
            storage: {
                data: {
                    driver: "cookie/header",
                    options: {
                        key: "<!-- ??? -->",
                    },
                },
            },
        },
    },
    development: {
        mongoose: {
            uri: "<!-- ??? -->",
            options: {
                dbName: "<!-- ??? -->",
                user: "<!-- ??? -->",
                pass: "<!-- ??? -->",
            },
        },
    },
    production: {
        mongoose: {
            uri: "<!-- ??? -->",
            options: {
                dbName: "<!-- ??? -->",
                user: "<!-- ??? -->",
                pass: "<!-- ??? -->",
            },
        },
    },
};

const client = {
    global: {
        title: "微光档案",
        author: "山吹色御守",
        description: "虚幻的幸福",
        avatar: "/garden/avatar/maestrale.webp",
        favicon: "/garden/favicon.svg",
        jumbotron: {
            title: "微光茶馆",
            summary: "微かの力を尽くして、光の届いた彼方へ",
        },
        cdnUrl: "https://cdn.bikari.top",
        totalYears: Array.from({ length: new Date().getFullYear() - 2022 }, (_, i) => 2023 + i).reverse(),
    },
    development: {
        domain: "zinkawaii",
    },
    production: {
        domain: "bikari.top",
    },
};

const env = import.meta.env.NODE_ENV as NodeEnv;
export const serverConfig = defu(server[env], server.global);
export const clientConfig = defu(client[env], client.global);
