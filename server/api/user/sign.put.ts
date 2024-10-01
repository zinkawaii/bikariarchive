import { z } from "zod";
import type { PutUserSignBody } from "~~/server/types/api/user/sign";

const schema = z.object({
    content: z.string()
});

export default defineJEventHandler(async (event) => {
    const { session } = event.context;
    const { content } = schema.parse(
        await readBody<PutUserSignBody>(event)
    );

    //权限验证
    identityValidate(event, 1);

    const qUser = await UserDataModel.updateOne({
        uid: session.uid
    }, {
        sign: content
    });

    //找不到用户
    if (qUser.matchedCount === 0) {
        return 1;
    }
});