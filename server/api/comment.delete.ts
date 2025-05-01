import { type } from "arktype";
import type { DeleteCommentBody } from "~~/server/types/api/comment";

const schema = type({
    id: "string",
});

export default defineJEventHandler(async (event) => {
    const { id } = schema.assert(
        await readBody<DeleteCommentBody>(event),
    );

    //权限验证
    identityValidate(event, 9);

    //删除评论
    await CommentDataModel.deleteOne({
        _id: id,
    });

    //删除作为子评论的引用
    await CommentDataModel.findOneAndUpdate({
        children: {
            $in: [id],
        },
    }, {
        $pull: {
            children: id,
        },
    });
});
