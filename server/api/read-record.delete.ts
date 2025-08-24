import { type } from "arktype";
import { ReadRecordModel } from "~~/server/models/ReadRecord";
import type { DeleteReadRecordBody } from "~~/server/types/api/read-record";

const schema = type({
    id: "string",
});

export default defineJEventHandler(async (event) => {
    const { id } = schema.assert(
        await readBody<DeleteReadRecordBody>(event),
    );

    //权限验证
    validateIdentity(event, 9);

    //连接数据库
    await connectMongoose();

    try {
        await ReadRecordModel.deleteOne({
            _id: id,
        });
    }
    catch {
        //ID不存在
        return 1;
    }
});
