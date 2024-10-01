import dayjs from "dayjs";
import { z } from "zod";
import { Zexp } from "~/utils";
import type { PutCommentBody } from "~~/server/types/api/comment";

const schema = z.object({
    id: z.string(),
    content: z.string().max(512),
    nickname: z.string().regex(Zexp.nickname),
    address: z.string().regex(Zexp.url).optional()
});

export default defineJEventHandler(async (event) => {
    const body = schema.parse(
        await readBody<PutCommentBody>(event)
    );

    //权限验证
    identityValidate(event, 9);

    //获取时间
    const time = dayjs.tz();

    //更新评论数据
    await CommentDataModel.findOneAndUpdate({
        _id: body.id
    }, {
        content: body.content,
        updated: time,
        nickname: body.nickname,
        address: body.address
    });
});