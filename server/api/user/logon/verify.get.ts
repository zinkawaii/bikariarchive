export default defineCustomHandler(async (event) => {
    const res: BaseResponse = { error: 0 };
    const { email } = getQueryValues(event);

    //预生成验证码
    const time = Date.now();
    let verify = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");

    //查询数据库中是否已存在该邮箱未处理的验证码
    const result = await TempVerifyModel.findOne({ email });

    let query = null;
    if (result) {
        if (result.time.getTime() + 1800000 >= time) {
            verify = result.verify;
        }
        else {
            //上一个验证码超时，对数据进行更新
            query = TempVerifyModel.updateOne({ email }, { time, verify });
        }
    }
    else {
        //无该邮箱未处理的验证码，添加临时数据
        query = TempVerifyModel.insertMany([{ time, verify, email }]);
    }

    //执行查询
    query?.exec?.();

    //发送验证码
    await sendMail({
        to: email,
        title: "注册验证码",
        template: "verify",
        props: { verify }
    })
    .catch(() => {
        res.error = 1;
    });

    return res;
});