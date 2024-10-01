import { z } from "zod";
import type { DeleteReadRecordBody } from "~~/server/types/api/read-record";

const schema = z.object({
    id: z.string()
});

export default defineJEventHandler(async (event) => {
    const { id } = schema.parse(
        await readBody<DeleteReadRecordBody>(event)
    );

    //权限验证
    identityValidate(event, 9);

    try {
        await ReadRecordModel.deleteOne({
            _id: id
        });
    }
    catch (err) {
        //ID不存在
        return 1;
    }
});