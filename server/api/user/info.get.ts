interface GetUserInfoResponse extends BaseResponse {
    uid?: number,
    nickname?: string,
    identity?: number,
    sign?: string,
    isLogin?: boolean
}

export default defineCustomHandler<GetUserInfoResponse>(async (event, res) => {
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