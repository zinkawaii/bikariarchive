import { type } from "arktype";
import { Zexp } from "~/utils";
import { CommentDataModel } from "~~/server/models/CommentData";
import type { PutCommentBody } from "~~/server/types/api/comment";

const schema = type({
    id: "string",
    content: "string <= 512",
    nickname: type(Zexp.nickname).optional(),
    email: type(Zexp.email).optional(),
    address: type(Zexp.url).optional(),
});

export default defineJEventHandler(async (event) => {
    const body = schema.assert(
        await readBody<PutCommentBody>(event),
    );

    //权限验证
    identityValidate(event, 9);

    //连接数据库
    await connectMongoose();

    //获取时间
    const time = new Date();

    //获取评论
    const qComment = await CommentDataModel.findOne({
        _id: body.id,
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
            address: body.address,
        };
    }

    //更新评论数据
    await qComment.updateOne({
        content: body.content,
        updated: time,
        ...extra,
    });
});
