import merge from "merge";

const server = {
    global: {
        env: process.env.NODE_ENV,
        address: "<!-- ??? -->",
        mail: {
            name: "微光档案",
            host: "smtp.qq.com",
            port: 465,
            auth: {
                user: "<!-- ??? -->",
                pass: "<!-- ??? -->"
            }
        },
        mongoose: {
            uri: "<!-- ??? -->",
            options: {
                dbName: "<!-- ??? -->",
                user: "<!-- ??? -->",
                pass: "<!-- ??? -->"
            }
        },
        session: {
            maxAge: 86400 * 30,
            storage: {
                driver: "cookie",
                options: {
                    key: "<!-- ??? -->"
                }
            }
        }
    },
    development: {
        mongoose: {
            options: {
                dbName: "<!-- ??? -->"
            }
        }
    },
    production: {}
};

const client = {
    global: {
        author: "山吹色御守",
        avatar: "/garden/avatar/tsumugi.webp",
        jumbotron: {
            main: "微光茶館",
            sub: "微かの力を尽くして、光の導いた彼方へ"
        }
    },
    development: {
        domain: "zinkawaii"
    },
    production: {
        domain: "bikari.top"
    }
};

const env = process.env.NODE_ENV;
export const serverConfig = merge.recursive(server.global, server[env]);
export const clientConfig = merge.recursive(client.global, client[env]);