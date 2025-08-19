import defu from "defu";

export const serverConfig = {
    article: {
        key: "<!-- ??? -->",
    },
    comment: {
        "/tweet": {
            identity: 9,
        },
    },
    mail: {
        host: "<!-- ??? -->",
        port: "<!-- ??? -->",
        user: "<!-- ??? -->",
        password: "<!-- ??? -->",
    },
    mongoose: {
        uri: "<!-- ??? -->",
        options: {
            dbName: "<!-- ??? -->",
            user: "<!-- ??? -->",
            pass: "<!-- ??? -->",
        },
    },
};

const client = {
    global: {
        title: "微光档案",
        author: "山吹色御守",
        description: "虚幻的幸福",
        summary: "微かな力を尽くして、光の届いた彼方へ",
        avatar: "/garden/avatar/maestrale.webp",
        favicon: "/garden/favicon.svg",
        totalYears: Array.from({ length: new Date().getFullYear() - 2022 }, (_, i) => 2023 + i).reverse(),
    },
    development: {
        domain: "zinkawaii",
    },
    production: {
        domain: "archive.bikari.top",
    },
};

const env = process.env.NODE_ENV as "development" | "production";
export const clientConfig = defu(client[env], client.global);
