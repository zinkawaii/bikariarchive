interface PutUserSignResponse extends BaseResponse {
    content?: string
}

export default defineCustomHandler<PutUserSignResponse>(async (event, res) => {
    const { session } = event.context;
    const { content } = await readBody(event);

    if (session.uid > 0) {
        const result = await UserDataModel.updateOne({
            uid: session.uid
        }, {
            sign: content
        });

        if (result.matchedCount === 0) {
            //找不到用户
            res.error = 2;
        }
    }
    else {
        //用户未登录
        res.error = 1;
    }
});