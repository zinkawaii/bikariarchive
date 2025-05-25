import { type } from "arktype";
import { UserDataModel } from "~~/server/models/UserData";
import { generateAvatarUrl } from "~~/server/utils";
import type { GetUserInfoResponse } from "~~/server/types/api/user/info";

const schema = type({
    uid: "string.numeric.parse?",
});

export default defineJEventHandler<GetUserInfoResponse>(async (event, res) => {
    const { session } = event.context;
    const { uid = session.uid } = schema.assert(getQuery(event));

    //连接数据库
    await connectMongoose();

    const qUser = await UserDataModel.findOne({
        uid,
    }, "nickname email identity sign");

    //用户不存在
    if (!qUser) {
        return 1;
    }

    res.uid = uid!;
    res.nickname = qUser.nickname;
    res.avatar = generateAvatarUrl(qUser.email);
    res.sign = qUser.sign;

    try {
        //只有本人才能获取的信息
        myselfValidate(event, uid!);
        res.identity = qUser.identity;
    }
    catch {}
});
