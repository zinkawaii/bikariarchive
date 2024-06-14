import type { GetUserInfoResponse } from "~~/server/types/api/user/info";

export default defineJEventHandler<GetUserInfoResponse>(async (event, res) => {
    const { session } = event.context;

    const query = getQueryValues(event);
    const queryUid = Number(query.uid);
    const uid = queryUid || session.uid;

    const qUser = await UserDataModel.findOne({
        uid
    }, "nickname identity sign");

    //用户不存在
    if (!qUser) {
        return 1;
    }

    res.uid = uid;
    res.nickname = qUser.nickname;
    res.sign = qUser.sign;

    try {
        //只有本人才能获取的信息
        myselfValidate(event, queryUid);
        res.identity = qUser.identity;
    }
    catch {}
});