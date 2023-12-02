import InnerCode from "~/server/core/InnerCode";

interface PostLoginResponse extends BaseResponse {
    uid?: number,
    nickname?: string,
    identity?: number,
    sign?: string
}

export default defineCustomHandler(async (event) => {
    const res: PostLoginResponse = { error: 0 };
    const { session } = event.context;
    const {
        account: acc,
        password: pwd
    } = await readBody(event);

    //查询UID、昵称或邮箱
    const result = await UserDataModel.findOne({
        $or: [
            { uid: Number(acc) || -1 },
            { nickname: acc },
            { email: acc }
        ]
    }, "uid nickname identity sign hash salt") as any;

    if (result) {
        const {
            uid,
            nickname,
            identity,
            sign,
            hash,
            salt
        } = result;

        //哈希验证
        const p_hash = InnerCode.encrypt(pwd, salt);
        if (p_hash === hash) {
            res.uid = uid;
            res.nickname = nickname;
            res.identity = identity;
            res.sign = sign;

            //写入会话
            session.uid = uid;
            session.identity = identity;
        }
        else {
            //密码错误
            res.error = 2;
        }
    }
    else {
        //账号不存在
        res.error = 1;
    }

    return res;
});