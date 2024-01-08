import nodemailer from "nodemailer";
import fs from "fs-extra";

const config = useRuntimeConfig();
const transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    auth: config.mail.auth,
    secure: true
});

export default {
    //发送邮件
    send(email: string, title: string, content: string) {
        return transporter.sendMail({
            from: {
                name: config.mail.name,
                address: config.mail.auth.user
            },
            subject: title,
            to: email,
            html: content
        });
    },

    //邮件模板
    async template(key: string, ...args: string[]) {
        //读取文本
        const file = await fs.readFile(r(`data/mail/${key}.txt`));

        //参数替换
        return args.reduce((mail, word, index) => {
            return mail.replaceAll(new RegExp(`\\{${index}\\}`, "g"), word);
        }, file.toString());
    }
};