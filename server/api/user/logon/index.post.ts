import { type } from "arktype";
import { Zexp } from "~/utils";
import { randomInt } from "~/utils/random";
import { TempVerifyModel } from "~~/server/models/TempVerify";
import { UserDataModel } from "~~/server/models/UserData";
import type { GetLoginBody, GetLogonResponse } from "~~/server/types/api/user/logon";

const schema = type({
    nickname: type(Zexp.nickname),
    email: type(Zexp.email),
    verify: "string == 6",
    password: type(Zexp.password),
});

export default defineJEventHandler<GetLogonResponse>(async (event) => {
    const { session } = event.context;
    const { nickname, email, verify, password } = schema.assert(
        await readBody<GetLoginBody>(event),
    );

    //查询用户信息中是否存在该邮箱所注册的账号
    const qUser = await UserDataModel.findOne({ email });

    //邮箱已注册
    if (qUser) {
        return 1;
    }

    //查询数据库中是否已存在该邮箱未处理的验证码
    const qVerify = await TempVerifyModel.findOne({ email });

    //验证码不存在
    if (!qVerify) {
        return 2;
    }

    //验证码已过期
    if (qVerify.time.getTime() + 1800000 < Date.now()) {
        return 3;
    }

    //验证码不正确
    if (verify !== qVerify.verify) {
        return 4;
    }

    //验证成功，从数据库中删除临时数据
    TempVerifyModel.deleteOne({ email }).exec();

    //UID
    const uid = createUid();

    //性别
    const sex = 0;

    //权限
    const identity = 1;

    //创建时间
    const createTime = new Date();

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
        salt,
    });

    //写入会话
    session.uid = uid;
    session.identity = identity;
});

//UID生成
function createUid() {
    const uid = randomInt(10000, 100000);
    return uid;
}
