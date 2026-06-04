import { type } from "arktype";
import { getQuery } from "nitro/h3";
import { UserDataModel } from "#server/models/UserData";
import type { PostLoginResponse } from "#server/api/user/login.post";

export type GetUserInfoQuery = typeof schema.inferIn;

export interface GetUserInfoResponse extends PostLoginResponse {}

const schema = type({
    uid: "string.numeric.parse?",
});

export default defineJEventHandler<{
    query: GetUserInfoQuery;
}, GetUserInfoResponse>(async (event, res) => {
    const session = await readSession(event);
    const { uid = session.data.uid } = schema.assert(getQuery(event));

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
        validateMyself(session.data, uid!);
        res.identity = qUser.identity;
    }
    catch {}
});
