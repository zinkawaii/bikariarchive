import { createEmail } from "unemail";
import smtp from "unemail/driver/smtp";
import { type Component, createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import type { ComponentProps } from "vue-component-type-helpers";

export async function sendEmail<T extends Component>(component: T, options: {
    to: string;
    title: string;
    props: ComponentProps<T>;
}) {
    const config = useRuntimeConfig();

    //创建服务
    const email = createEmail({
        driver: smtp({
            host: config.mail.host,
            port: +config.mail.port,
            user: config.mail.user,
            password: config.mail.password,
            secure: true,
        }),
    });

    //编译模板
    const app = createSSRApp(component, options.props ?? {});
    const text = await renderToString(app);
    const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">${text}`;

    //发送邮件
    return email.send({
        from: {
            email: config.mail.user,
            name: config.public.title,
        },
        to: {
            email: options.to,
        },
        subject: options.title,
        html,
    });
}
