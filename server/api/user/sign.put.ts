interface PutUserSignBody {
    content: string;
}

interface PutUserSignResponse extends BaseResponse {
    content?: string;
}

export default defineWrappedHandler<PutUserSignResponse>(async (event) => {
    const { session } = event.context;
    const { content } = await readBody<PutUserSignBody>(event);

    //用户未登录
    if (session.uid <= 0) {
        return 1;
    }

    const qUser = await UserDataModel.updateOne({
        uid: session.uid
    }, {
        sign: content
    });

    //找不到用户
    if (qUser.matchedCount === 0) {
        return 2;
    }
});