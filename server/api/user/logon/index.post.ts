import dayjs from "dayjs";
import InnerCode from "~/server/core/InnerCode";

interface GetLogonResponse extends BaseResponse {
    uid?: number,
    nickname?: string,
    identity?: number
}

export default defineCustomHandler(async (event) => {
    const res: GetLogonResponse = { error: 0 };
    const { session } = event.context;
    const {
        nickname,
        email,
        verify,
        password
    } = await readBody(event);

    //服务端验证
    if (check_params(nickname, email, password) === true) {
        //查询用户信息中是否存在该邮箱所注册的账号
        const result = await UserDataModel.findOne({ email });

        if (!result) {
            //查询数据库中是否已存在该邮箱未处理的验证码
            const result = await TempVerifyModel.findOne({ email }) as any;

            if (result) {
                if (result.time.getTime() + 1800000 >= Date.now()) {
                    if (verify === result.verify) {
                        //验证成功，从数据库中删除临时数据
                        TempVerifyModel.deleteOne({ email }).exec();

                        //UID等
                        const uid = create_uid();

                        //性别
                        const sex = 0;

                        //权限
                        const identity = 1;

                        //创建时间
                        const createTime = dayjs.tz();

                        //哈希和盐值
                        const { hash, salt } = InnerCode.create(password);

                        //新增用户信息
                        UserDataModel.insertMany({
                            uid,
                            nickname,
                            email,
                            sex,
                            identity,
                            createTime,
                            hash,
                            salt
                        });

                        //写入会话
                        session.uid = uid;
                        session.identity = identity;
                    }
                    else {
                        //验证码不正确
                        res.error = 4;
                    }
                }
                else {
                    //验证码已过期
                    res.error = 3;
                }
            }
            else {
                //验证码不存在
                res.error = 2;
            }
        }
        else {
            //邮箱已注册
            res.error = 1;
        }
    }
    else {
        //表单验证失败
        res.error = 100;
    }

    return res;
});

//服务端验证
function check_params(nickname: string, email: string, password: string) {
    if (
        (/^[\w\u4e00-\u9fa5]{0,18}$/).test(nickname) &&
        (/^[\w-]+@[\w-]+(.[\w-]+)+$/).test(email) &&
        (/^[\w]{6,18}$/).test(password)
    ) {
        return true;
    }
    else return false;
}

//UID生成
function create_uid() {
    const uid = Math.floor(Math.random() * (100000 - 10000) + 10000);
    return uid;
}