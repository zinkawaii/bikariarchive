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
    throw HTTPError.status(404);
  }
});
