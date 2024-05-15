import defu from "defu";

const server = {
    global: {
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
        title: "微光档案",
        author: "山吹色御守",
        avatar: "/garden/avatar/tsumugi.webp",
        description: "虚幻的幸福",
        jumbotron: {
            title: "微光茶馆",
            summary: "微かの力を尽くして、光の届いた彼方へ"
        }
    },
    development: {
        domain: "zinkawaii"
    },
    production: {
        domain: "bikari.top"
    }
};

const env = import.meta.env.NODE_ENV;
export const serverConfig = defu(server[env], server.global);
export const clientConfig = defu(client[env], client.global);