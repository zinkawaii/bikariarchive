interface GetUserInfoResponse extends BaseResponse {
    uid?: number,
    nickname?: string,
    identity?: number,
    sign?: string,
    isLogin?: boolean
}

export default defineCustomHandler<GetUserInfoResponse>(async (event, res) => {
    const { session } = event.context;

    const result = await UserDataModel.findOne({
        uid: session.uid
    }, "nickname identity sign");

    if (result) {
        res.uid = session.uid;
        res.nickname = result.nickname;
        res.identity = result.identity;
        res.sign = result.sign;
        res.isLogin = true;
    }
    else {
        res.isLogin = false;
    }
});