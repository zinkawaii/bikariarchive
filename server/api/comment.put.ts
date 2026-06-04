import { type } from "arktype";
import { CommentDataModel } from "#server/models/CommentData";

export type PutCommentBody = typeof schema.inferIn;

const schema = type({
    id: "string",
    content: "string <= 512",
    nickname: "string <= 18?",
    email: "string.email?",
    address: "string.url?",
});

export default defineJEventHandler<{
    body: PutCommentBody;
}>(async (event) => {
    const session = await readSession(event);
    const body = schema.assert(await event.req.json());

    //权限验证
    validateIdentity(session.data, 9);

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
        throw 1;
    }

    //更新评论数据
    await qComment.updateOne({
        content: body.content,
        updated: time,
        ...qComment.mode === "guest" ? {
            nickname: body.nickname,
            email: body.email,
            address: body.address,
        } : void 0,
    });
});
