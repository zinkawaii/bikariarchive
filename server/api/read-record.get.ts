import { z } from "zod";
import type { GetReadRecordResponse } from "~~/server/types/api/read-record";

const schema = z.object({
    from: z.string().transform(Number),
    to: z.string().transform(Number)
});

export default defineJEventHandler<GetReadRecordResponse>(async (event, res) => {
    let { from, to } = schema.parse(getQuery(event));

    //权限验证
    identityValidate(event, 9);

    //<from>始终小于<to>
    if (from > to) [from, to] = [to, from];

    //符号不一致
    if (to && (from ^ to) <= 0) {
        return 1;
    }

    const sort = from < 0 ? -1 : 1;
    const count = to - from;
    const skip = from >= 0 ? from : Math.abs(to);

    if (count > 0) {
        res.data = await ReadRecordModel.find()
        .sort({ _id: sort })
        .skip(skip)
        .limit(count)
        .populate<{
            _id: string;
            user: { uid: number };
        }>({ path: "user", select: "uid" });
    }
});