import { type } from "arktype";
import { UserDataModel } from "~~/server/models/UserData";
import type { PutUserSignBody } from "~~/server/types/api/user/sign";

const schema = type({
    content: "string",
});

export default defineJEventHandler(async (event) => {
    const { session } = event.context;
    const { content } = schema.assert(
        await readBody<PutUserSignBody>(event),
    );

    //权限验证
    identityValidate(event, 1);

    //连接数据库
    await connectMongoose();

    const qUser = await UserDataModel.updateOne({
        uid: session.uid,
    }, {
        sign: content,
    });

    //找不到用户
    if (qUser.matchedCount === 0) {
        return 1;
    }
});
