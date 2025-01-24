import { z } from "zod";
import { Zexp } from "~/utils";
import type { PutCommentBody } from "~~/server/types/api/comment";

const schema = z.object({
    id: z.string(),
    content: z.string().max(512),
    nickname: z.string().regex(Zexp.nickname).optional(),
    email: z.string().regex(Zexp.email).optional(),
    address: z.string().regex(Zexp.url).optional()
});

export default defineJEventHandler(async (event) => {
    const body = schema.parse(
        await readBody<PutCommentBody>(event)
    );

    //权限验证
    identityValidate(event, 9);

    //获取时间
    const time = new Date();

    //获取评论
    const qComment = await CommentDataModel.findOne({
        _id: body.id
    });

    //评论不存在
    if (!qComment) {
        return 1;
    }

    let extra = {};
    if (qComment.mode === "guest") {
        extra = {
            nickname: body.nickname,
            email: body.email,
            address: body.address
        };
    }

    //更新评论数据
    await qComment.updateOne({
        content: body.content,
        updated: time,
        ...extra
    });
});