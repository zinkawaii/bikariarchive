import type { PostLoginBody, PostLoginResponse } from "~~/server/types/api/user/login";

export default defineJEventHandler<PostLoginResponse>(async (event, res) => {
    const { session } = event.context;
    const {
        account: acc,
        password: pwd
    } = await readBody<PostLoginBody>(event);

    //查询UID、昵称或邮箱
    const qUser = await UserDataModel.findOne({
        $or: [
            { uid: Number(acc) || -1 },
            { nickname: acc },
            { email: acc }
        ]
    }, "uid nickname identity sign hash salt");

    //账号不存在
    if (!qUser) {
        return 1;
    }

    const {
        uid,
        nickname,
        identity,
        sign,
        hash,
        salt
    } = qUser;

    //哈希验证
    const p_hash = InnerCode.encrypt(pwd, salt);

    //密码错误
    if (p_hash !== hash) {
        return 2;
    }

    res.uid = uid;
    res.nickname = nickname;
    res.identity = identity;
    res.sign = sign;

    //写入会话
    session.uid = uid;
    session.identity = identity;
});