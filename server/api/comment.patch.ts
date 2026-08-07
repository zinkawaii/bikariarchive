import { type } from "arktype";
import { HTTPError } from "nitro/h3";
import { CommentDataModel } from "#server/models/CommentData";

export type PatchCommentBody = typeof schema.inferIn;

const schema = type({
  id: "string",
});

export default defineJEventHandler<{
  body: PatchCommentBody;
}>(async (event) => {
  const { id } = schema.assert(await event.req.json());

  // 权限验证
  await validateIdentity(event);

  // 连接数据库
  await connectMongoose();

  // 更新评论数据
  const comment = await CommentDataModel.findOneAndUpdate({
    _id: id,
    status: "pending",
  }, {
    status: "public",
  }).select("path parent content nickname");

  // 评论不存在
  if (!comment) {
    return HTTPError.status(404);
  }

  // 获取所回复的评论
  const parent = await CommentDataModel.findOne({
    _id: comment.parent,
  }).select("email");

  // 发送回复邮件
  sendReplyEmail(event, comment, parent);
});
