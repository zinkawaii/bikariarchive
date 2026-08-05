import { type } from "arktype";
import { HTTPError } from "nitro/h3";
import { CommentDataModel } from "#server/models/CommentData";

export type PutCommentBody = typeof schema.inferIn;

const schema = type({
  id: "string",
  content: "string <= 512",
  nickname: "string <= 18",
  email: "string.email?",
  address: "string.url?",
});

export default defineJEventHandler<{
  body: PutCommentBody;
}>(async (event) => {
  const body = schema.assert(await event.req.json());

  // 权限验证
  await validateIdentity(event);

  // 连接数据库
  await connectMongoose();

  // 获取评论
  const comment = await CommentDataModel.findOne({
    _id: body.id,
  });

  // 评论不存在
  if (!comment) {
    throw HTTPError.status(404);
  }

  // 更新评论数据
  await comment.updateOne({
    content: body.content,
    nickname: body.nickname,
    email: body.email,
    address: body.address,
    updated: new Date(),
  });
});
