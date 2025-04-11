import { type } from "arktype";
import type { DeleteReadRecordBody } from "~~/server/types/api/read-record";

const schema = type({
    id: "string"
});

export default defineJEventHandler(async (event) => {
    const { id } = schema.assert(
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