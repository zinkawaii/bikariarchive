import { type } from "arktype";
import { getQuery } from "nitro/h3";
import { ReadRecordModel } from "#server/models/ReadRecord";
import type { ReadRecordSchema, UserDataSchema } from "#server/types/model";

export type GetReadRecordQuery = typeof schema.inferIn;

export interface GetReadRecordResponse {
    total: number;
    sizes: number;
    list: (Omit<ReadRecordSchema, "user"> & {
        _id: string;
        user?: Pick<UserDataSchema, "uid">;
    })[];
}

const schema = type({
    page: "string.numeric.parse",
});

export default defineJEventHandler<{
    query: GetReadRecordQuery;
}, GetReadRecordResponse>(async (event, res) => {
    const session = await readSession(event);
    const { page } = schema.assert(getQuery(event));

    if (page < 1) {
        throw 1;
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
