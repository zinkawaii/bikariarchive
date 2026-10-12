import { type } from "arktype";
import { defineHandler } from "nitro";
import { createError, getRequestIP, readValidatedBody, useRuntimeConfig } from "nuxt/server";
import { CommentDataModel } from "#server/models/CommentData";

export type PostCommentBody = typeof schema.inferIn;

const schema = type({
  path: parseCommentPath,
  parent: parseObjectId.optional(),
  content: "0 < string <= 512",
  nickname: "0 < string <= 18",
  email: "string.email?",
  address: "string.url?",
});

export default defineHandler<{ body: PostCommentBody }>(async (event) => {
  const config = useRuntimeConfig();
  const body = await readValidatedBody(event, schema);

  // 只读页面
  if (Reflect.get(config.comment, body.path)?.readonly) {
    await validateIdentity(event);
  }

  // 连接数据库
  await connectMongoose();

  // 获取用户会话
  const session = await getUserSession(event);
  const isAdmin = session.user?.role === "admin";

  // 获取时间
  const time = new Date();

  // 获取所回复的评论
  const parent = await CommentDataModel.findOne({
    path: body.path,
    _id: body.parent,
  }).select("root email");

  if (body.parent && !parent) {
    throw createError({ status: 404 });
  }

  // 写入评论数据
  const comment = await CommentDataModel.create({
    path: body.path,
    root: parent?.root ?? parent?._id,
    parent: body.parent,
    content: body.content,
    time,
    updated: time,
    ip: getRequestIP(event, { xForwardedFor: true }),
    nickname: body.nickname,
    email: body.email,
    address: body.address,
    token: isAdmin ? void 0 : session.id,
    status: isAdmin ? "public" : "pending",
  });

  // 发送回复邮件
  if (isAdmin) {
    sendReplyEmail(event, comment, parent);
  }
});
