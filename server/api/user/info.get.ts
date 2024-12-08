import { z } from "zod";
import { generateAvatarUrl } from "~~/server/utils";
import type { GetUserInfoResponse } from "~~/server/types/api/user/info";

const schema = z.object({
    uid: z.string().optional().transform((val) => Number(val) || void 0)
});

export default defineJEventHandler<GetUserInfoResponse>(async (event, res) => {
    const { session } = event.context;
    const { uid = session.uid } = schema.parse(getQuery(event));

    const qUser = await UserDataModel.findOne({
        uid
    }, "nickname email identity sign");

    //用户不存在
    if (!qUser) {
        return 1;
    }

    res.uid = uid;
    res.nickname = qUser.nickname;
    res.avatar = generateAvatarUrl(qUser.email);
    res.sign = qUser.sign;

    try {
        //只有本人才能获取的信息
        myselfValidate(event, uid!);
        res.identity = qUser.identity;
    }
    catch {}
});