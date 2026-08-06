import { type } from "arktype";
import { CommentDataModel } from "#server/models/CommentData";

export type DeleteCommentBody = typeof schema.inferIn;

const schema = type({
  id: "string",
});

export default defineJEventHandler<{
  body: DeleteCommentBody;
}>(async (event) => {
  const body = schema.assert(await event.req.json());

  // 权限验证
  await validateIdentity(event);

  // 连接数据库
  await connectMongoose();

  // 删除评论
  await CommentDataModel.deleteOne({
    _id: body.id,
  });
});
