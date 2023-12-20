const server = {
    global: {
        env: process.env.NODE_ENV,
        address: "<!-- ??? -->",
        mail: {
            name: "微光茶馆",
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
    development: {},
    production: {}
};

const client = {
    global: {

    },
    development: {
        domain: "zinkawaii"
    },
    production: {
        domain: "bikariarchive.xyz"
    }
};

export const serverConfig = { ...server.global, ...server[process.env.NODE_ENV] };
export const clientConfig = { ...client.global, ...client[process.env.NODE_ENV] };