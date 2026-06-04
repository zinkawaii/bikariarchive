import { type } from "arktype";
import { UserDataModel } from "#server/models/UserData";

export type PostLoginBody = typeof schema.inferIn;

export interface PostLoginResponse {
    uid: number;
    nickname: string;
    avatar: string;
    identity: number;
    sign: string;
}

const schema = type({
    account: "string",
    password: "string",
});

export default defineJEventHandler<{
    body: PostLoginBody;
}, PostLoginResponse>(async (event, res) => {
    const session = await readSession(event);
    const { account, password } = schema.assert(await event.req.json());

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
        throw 1;
    }

    const { uid, nickname, email, identity, sign, hash, salt } = qUser;

    //密码错误
    if (hash !== encryptSecret(password, salt)) {
        throw 2;
    }

    res.uid = uid;
    res.nickname = nickname;
    res.avatar = generateAvatarUrl(email);
    res.identity = identity;
    res.sign = sign;

    //写入会话
    await session.update({
        uid,
        identity,
    });
});
