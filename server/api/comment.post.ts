import { type } from "arktype";
import { getRequestIP } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";
import { CommentDataModel } from "#server/models/CommentData";

export type PostCommentBody = typeof schema.inferIn;

const schema = type({
  path: parseCommentPath,
  parent: "string?",
  content: "0 < string <= 512",
  nickname: "0 < string <= 18",
  email: "string.email?",
  address: "string.url?",
});

export default defineJEventHandler<{
  body: PostCommentBody;
}>(async (event) => {
  const config = useRuntimeConfig();
  const body = schema.assert(await event.req.json());

  // 只读页面
  if (Reflect.get(config.comment, body.path)?.readonly) {
    await validateIdentity(event);
  }

  // 连接数据库
  await connectMongoose();

  // 获取时间
  const time = new Date();

  // 获取权限
  const isAdmin = await isIdentityAdmin(event);

  // 获取所回复的评论
  const parent = await CommentDataModel.findOne({
    _id: body.parent,
  }).select("root");

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
    status: isAdmin ? "public" : "pending",
  });

  // 发送回复邮件
  if (isAdmin) {
    sendReplyEmail(event, comment, parent);
  }
});
