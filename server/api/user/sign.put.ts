import { type } from "arktype";
import { UserDataModel } from "#server/models/UserData";

export type PutUserSignBody = typeof schema.inferIn;

const schema = type({
    content: "string",
});

export default defineJEventHandler(async (event) => {
    const session = await readSession(event);
    const { content } = schema.assert(await event.req.json());

    //权限验证
    validateIdentity(session.data, 1);

    //连接数据库
    await connectMongoose();

    const qUser = await UserDataModel.updateOne({
        uid: session.data.uid,
    }, {
        sign: content,
    });

    //找不到用户
    if (qUser.matchedCount === 0) {
        return 1;
    }
});
