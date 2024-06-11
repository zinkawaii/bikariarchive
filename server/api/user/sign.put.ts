import type { PutUserSignBody, PutUserSignResponse } from "~~/server/types/api/user/sign";

export default defineJEventHandler<PutUserSignResponse>(async (event) => {
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