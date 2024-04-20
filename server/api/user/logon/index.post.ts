import dayjs from "dayjs";

interface GetLoginBody {
    nickname: string;
    email: string;
    verify: string;
    password: string;
}

interface GetLogonResponse extends BaseResponse {
    uid?: number;
    nickname?: string;
    identity?: number;
}

export default defineWrappedHandler<GetLogonResponse>(async (event) => {
    const { session } = event.context;
    const {
        nickname,
        email,
        verify,
        password
    } = await readBody<GetLoginBody>(event);

    //表单验证失败
    if (!validate(nickname, email, password)) {
        return 100;
    }

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
});

//服务端验证
function validate(nickname: string, email: string, password: string) {
    return (/^[\w\u4E00-\u9FA5]{0,18}$/).test(nickname) &&
           (/^[\w-]+@[\w-]+(.[\w-]+)+$/).test(email) &&
           (/^[\w]{6,18}$/).test(password);
}

//UID生成
function createUid() {
    const uid = Math.floor(Math.random() * (100000 - 10000) + 10000);
    return uid;
}