import { type } from "arktype";
import { HTTPError } from "nitro/h3";
import CommentReply from "#server/emails/comment-reply.vue";
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

  const parent = await CommentDataModel.findOne({
    _id: comment.parent,
  }).select("email");

  if (!parent) {
    return;
  }

  // 获取回复邮箱
  const email = parent.email;

  // 对被回复评论进行邮件通知
  if (email !== void 0 && email !== comment.email) {
    const task = sendEmail(CommentReply, {
      to: email,
      title: `@${comment.nickname} 回复了您的评论`,
      props: {
        content: comment.content,
        path: comment.path,
      },
    });
    event.waitUntil(task);
  }
});
