import { type } from "arktype";
import { UserDataModel } from "~~/server/models/UserData";
import { generateAvatarUrl } from "~~/server/utils";
import type { PostLoginBody, PostLoginResponse } from "~~/server/types/api/user/login";

const schema = type({
    account: "string",
    password: "string",
});

export default defineJEventHandler<PostLoginResponse>(async (event, res) => {
    const { session } = event.context;
    const { account, password } = schema.assert(
        await readBody<PostLoginBody>(event),
    );

    //连接数据库
    await connectMongoose();

    //查询UID、昵称或邮箱
    const qUser = await UserDataModel.findOne({
        $or: [
            { uid: Number(account) || -1 },
            { nickname: account },
            { email: account },
        ],
    }, "uid nickname email identity sign hash salt");

    //账号不存在
    if (!qUser) {
        return 1;
    }

    const { uid, nickname, email, identity, sign, hash, salt } = qUser;

    //密码错误
    if (hash !== InnerCode.encrypt(password, salt)) {
        return 2;
    }

    res.uid = uid;
    res.nickname = nickname;
    res.avatar = generateAvatarUrl(email);
    res.identity = identity;
    res.sign = sign;

    //写入会话
    session.uid = uid;
    session.identity = identity;
});
