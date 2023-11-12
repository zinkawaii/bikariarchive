import { defineCustomHandler } from "../utils/handler";
import { encrypt } from "../core/InnerCode";

interface PostLoginResponse extends BaseResponse {
    uid?: string,
    nickname?: string,
    identity?: number
};

export default defineCustomHandler(async (event) => {
    const res: PostLoginResponse = { error: 0 };
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
    }, "uid nickname identity hash salt");

    if (result) {
        const {
            uid,
            nickname,
            identity,
            hash,
            salt
        }: any = result;

        //哈希验证
        const p_hash = encrypt(pwd, salt);
        if (p_hash === hash) {
            res.uid = uid;
            res.nickname = nickname;
            res.identity = identity;
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