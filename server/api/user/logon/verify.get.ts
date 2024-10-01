import { z } from "zod";
import Verify from "~/emails/verify.vue";
import { Zexp } from "~/utils";

const schema = z.object({
    email: z.string().regex(Zexp.email)
});

export default defineJEventHandler(async (event) => {
    const { email } = schema.parse(getQuery(event));

    //预生成验证码
    const time = Date.now();
    let verify = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");

    //查询数据库中是否已存在该邮箱未处理的验证码
    const qVerify = await TempVerifyModel.findOne({ email });

    if (qVerify) {
        if (qVerify.time.getTime() + 1800000 >= time) {
            verify = qVerify.verify;
        }
        else {
            //上一个验证码超时，对数据进行更新
            await TempVerifyModel.updateOne({ email }, { time, verify });
        }
    }
    else {
        //无该邮箱未处理的验证码，添加临时数据
        await TempVerifyModel.insertMany([{ time, verify, email }]);
    }

    //发送验证码
    try {
        await sendMail(Verify, {
            to: email,
            title: "注册验证码",
            props: { verify }
        });
    }
    catch {
        return 1;
    }
});