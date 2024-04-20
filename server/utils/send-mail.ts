import nodemailer from "nodemailer";
import { useCompiler } from "#vue-email";

export async function sendMail(options: {
    to: string;
    title: string;
    template: string;
    props: Record<string, any>;
}) {
    const config = useRuntimeConfig();

    //创建连接
    const transporter = nodemailer.createTransport({
        host: config.mail.host,
        port: config.mail.port,
        auth: config.mail.auth,
        secure: true
    });

    //编译模板
    const template = await useCompiler(`${options.template}.vue`, {
        props: options.props
    });

    //发送邮件
    return transporter.sendMail({
        from: {
            name: config.mail.name,
            address: config.mail.auth.user
        },
        subject: options.title,
        to: options.to,
        html: template.html
    });
}