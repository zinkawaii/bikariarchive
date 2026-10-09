import { type } from "arktype";
import { defineHandler } from "nitro";
import { createError, readValidatedBody } from "nuxt/server";
import { CommentDataModel } from "#server/models/CommentData";

export type PutCommentBody = typeof schema.inferIn;

const schema = type({
  id: parseObjectId,
  content: "0 < string <= 512",
  nickname: "0 < string <= 18",
  email: "string.email?",
  address: "string.url?",
});

export default defineHandler<{ body: PutCommentBody }>(async (event) => {
  const body = await readValidatedBody(event, schema);

  // 权限验证
  await validateIdentity(event);

  // 连接数据库
  await connectMongoose();

  // 更新评论
  const result = await CommentDataModel.updateOne({
    _id: body.id,
  }, {
    content: body.content,
    nickname: body.nickname,
    email: body.email,
    address: body.address,
    updated: new Date(),
  });

  // 评论不存在
  if (!result.matchedCount) {
    throw createError({ status: 404 });
  }
});
