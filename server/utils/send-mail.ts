import nodemailer from "nodemailer";
import { useRender } from "vue-email-edge";
import type { Component } from "vue";

export async function sendMail(component: Component, options: {
    to: string;
    title: string;
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
    const template = await useRender(component, options.props);

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