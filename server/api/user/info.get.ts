import type { GetUserInfoResponse } from "~/server/types/api/user/info";

export default defineJEventHandler<GetUserInfoResponse>(async (event, res) => {
    const { session } = event.context;

    const qUser = await UserDataModel.findOne({
        uid: session.uid
    }, "nickname identity sign");

    if (qUser) {
        res.uid = session.uid;
        res.nickname = qUser.nickname;
        res.identity = qUser.identity;
        res.sign = qUser.sign;
        res.isLogin = true;
    }
    else {
        res.isLogin = false;
    }
});