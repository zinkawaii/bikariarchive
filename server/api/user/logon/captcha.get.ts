import { type } from "arktype";
import { TempCaptchaModel } from "#server/models/TempCaptcha";
import { randomInt } from "#shared/utils/random";
import Captcha from "~/emails/captcha.vue";

const schema = type({
    email: "string.email",
});

export default defineJEventHandler(async (event) => {
    const { email } = schema.assert(getQuery(event));

    //连接数据库
    await connectMongoose();

    //预生成验证码
    const time = Date.now();
    let captcha = randomInt(0, 1000000).toString().padStart(6, "0");

    //查询数据库中是否已存在该邮箱未处理的验证码
    const qCaptcha = await TempCaptchaModel.findOne({ email });

    if (qCaptcha) {
        if (qCaptcha.time.getTime() + 1800000 >= time) {
            captcha = qCaptcha.captcha;
        }
        else {
            //上一个验证码超时，对数据进行更新
            await TempCaptchaModel.updateOne({ email }, { time, captcha });
        }
    }
    else {
        //无该邮箱未处理的验证码，添加临时数据
        await TempCaptchaModel.insertMany([{ time, captcha, email }]);
    }

    //发送验证码
    try {
        await sendMail(Captcha, {
            to: email,
            title: "注册验证码",
            props: { captcha },
        });
    }
    catch {
        return 1;
    }
});
