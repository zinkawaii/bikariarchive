import { type } from "arktype";
import type { GetReadRecordResponse } from "~~/server/types/api/read-record";

const schema = type({
    page: "string.numeric.parse",
});

export default defineJEventHandler<GetReadRecordResponse>(async (event, res) => {
    const { page } = schema.assert(getQuery(event));

    if (page < 1) {
        return 1;
    }

    //权限验证
    identityValidate(event, 9);

    const sizes = 20;

    const total = await ReadRecordModel.countDocuments();

    const qRecords = await ReadRecordModel.find()
    .sort({ _id: -1 })
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
