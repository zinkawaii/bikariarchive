import { render } from "@vue-email/render";
import nodemailer from "nodemailer";
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
    const html = await render(component, options.props);

    //发送邮件
    return transporter.sendMail({
        from: {
            name: config.mail.name,
            address: config.mail.auth.user
        },
        subject: options.title,
        to: options.to,
        html
    });
}