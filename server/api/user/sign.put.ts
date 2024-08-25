import type { PutUserSignBody } from "~~/server/types/api/user/sign";

export default defineJEventHandler(async (event) => {
    const { session } = event.context;
    const { content } = await readBody<PutUserSignBody>(event);

    //权限验证
    identityValidate(event, 1);

    const qUser = await UserDataModel.updateOne({
        uid: session.uid
    }, {
        sign: content
    });

    //找不到用户
    if (qUser.matchedCount === 0) {
        return 1;
    }
});