import { type } from "arktype";
import { ReadRecordModel } from "#server/models/ReadRecord";

export type DeleteReadRecordBody = typeof schema.inferIn;

const schema = type({
    id: "string",
});

export default defineJEventHandler<{
    body: DeleteReadRecordBody;
}>(async (event) => {
    const session = await readSession(event);
    const { id } = schema.assert(await event.req.json());

    //权限验证
    validateIdentity(session.data, 9);

    //连接数据库
    await connectMongoose();

    try {
        await ReadRecordModel.deleteOne({
            _id: id,
        });
    }
    catch {
        //ID不存在
        throw 1;
    }
});
