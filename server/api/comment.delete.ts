import { type } from "arktype";
import { CommentDataModel } from "~~/server/models/CommentData";
import type { DeleteCommentBody } from "~~/server/types/api/comment";

const schema = type({
    id: "string",
});

export default defineJEventHandler(async (event) => {
    const session = await readSession(event);
    const { id } = schema.assert(
        await readBody<DeleteCommentBody>(event),
    );

    //权限验证
    validateIdentity(session.data, 9);

    //连接数据库
    await connectMongoose();

    //删除评论
    await CommentDataModel.deleteOne({
        _id: id,
    });
});
