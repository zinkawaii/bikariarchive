import { render } from "@vue-email/render";
import { createEmailService } from "unemail";
import smtp from "unemail/providers/smtp";
import type { Component } from "vue";

export async function sendMail(component: Component, options: {
    to: string;
    title: string;
    props: Record<string, any>;
}) {
    const config = useRuntimeConfig();

    //创建服务
    const service = createEmailService({
        provider: smtp({
            host: config.mail.host,
            port: config.mail.port,
            user: config.mail.user,
            password: config.mail.password,
            secure: true,
        }),
    });

    //编译模板
    const html = await render(component, options.props);

    //发送邮件
    return service.sendEmail({
        from: {
            email: config.mail.user,
            name: config.mail.name,
        },
        to: {
            email: options.to,
        },
        subject: options.title,
        html,
    });
}
