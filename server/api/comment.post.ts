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

  // 获取所回复评论的数据（如果有）
  const parent = await CommentDataModel.findOne({
    _id: body.parent,
  }).select("root");

  // 将评论数据写入数据库
  await CommentDataModel.create({
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
    status: await isIdentityAdmin(event) ? "public" : "pending",
  });
});
