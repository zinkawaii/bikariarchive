import { type } from "arktype";
import { defineHandler } from "nitro";
import { readValidatedBody } from "nuxt/server";
import { CommentDataModel } from "#server/models/CommentData";

export type DeleteCommentBody = typeof schema.inferIn;

const schema = type({
  id: parseObjectId,
});

export default defineHandler<{ body: DeleteCommentBody }>(async (event) => {
  const body = await readValidatedBody(event, schema);

  // 权限验证
  await validateIdentity(event);

  // 连接数据库
  await connectMongoose();

  // 删除评论
  await CommentDataModel.deleteOne({
    _id: body.id,
  });
});
