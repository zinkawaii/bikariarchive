import { type } from "arktype";
import { ReadRecordModel } from "#server/models/ReadRecord";
import type { GetReadRecordResponse } from "#server/types/api/read-record";

const schema = type({
    page: "string.numeric.parse",
});

export default defineJEventHandler<GetReadRecordResponse>(async (event, res) => {
    const session = await readSession(event);
    const { page } = schema.assert(getQuery(event));

    if (page < 1) {
        return 1;
    }

    //权限验证
    validateIdentity(session.data, 9);

    //连接数据库
    await connectMongoose();

    const sizes = 20;

    const total = await ReadRecordModel.countDocuments();

    const qRecords = await ReadRecordModel.find()
        .sort({ _id: "desc" })
        .skip((page - 1) * sizes)
        .limit(sizes)
        .populate<{
            _id: string;
            user: { uid: number };
        }>({ path: "user", select: "uid" });

    res.total = total;
    res.sizes = sizes;
    res.list = qRecords;
});
