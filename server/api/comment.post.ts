import { type } from "arktype";
import { getRequestIP } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";
import type { RuntimeConfig } from "@nuxt/schema";
import CommentReply from "#server/emails/comment-reply.vue";
import { CommentDataModel } from "#server/models/CommentData";
import { UserDataModel } from "#server/models/UserData";
import type { CommentDataSchema, UserDataSchema } from "#server/types/model";

export type PostCommentBody = typeof schema.inferIn;

const schema = type({
  path: "string",
  parent: "string?",
  content: "string <= 512",
  nickname: "string <= 18",
  email: "string.email?",
  address: "string.url?",
});

export default defineJEventHandler<{
  body: PostCommentBody;
}>(async (event) => {
  const config = useRuntimeConfig();
  const session = await readSession(event);
  const body = schema.assert(await event.req.json());

  // 获取严格路径
  const path = getStrictPath(body.path) as keyof RuntimeConfig["comment"];

  // 路径格式错误
  if (!path.startsWith("/")) {
    throw 1;
  }

  // 权限验证
  const identity = config.comment[path]?.identity ?? 0;
  validateIdentity(session.data, identity);

  // 连接数据库
  await connectMongoose();

  const mode = session.data.uid !== void 0 ? "user" : "guest";
  const time = new Date();

  // 附加信息
  let info:
    | Pick<CommentDataSchema, "nickname" | "email" | "address">
    | Pick<CommentDataSchema, "user">;

  if (mode === "guest") {
    // 无游客昵称
    if (!body.nickname) {
      throw 2;
    }

    info = {
      nickname: body.nickname,
      email: body.email,
      address: body.address,
    };
  }
  else {
    // 获取用户
    const qUser = await UserDataModel.findOne({
      uid: session.data.uid,
    });

    // 用户不存在
    if (!qUser) {
      throw 3;
    }

    info = {
      user: qUser._id,
    };
  }

  // 获取所回复评论的数据（如果有）
  const qParent = await CommentDataModel.findOne({
    _id: body.parent,
  }).populate<{
    user?: UserDataSchema;
  }>({
    path: "user",
    select: "email",
  });

  // 将评论数据写入数据库
  await CommentDataModel.create({
    path,
    root: qParent?.root ?? qParent?._id,
    parent: body.parent,
    content: body.content,
    time,
    updated: time,
    ip: getRequestIP(event, { xForwardedFor: true }),
    mode,
    ...info,
  });

  if (!qParent) {
    return;
  }

  // 获取回复邮箱
  const email = qParent.mode === "guest" ? qParent.email : qParent.user?.email;

  // 对被回复评论进行邮件通知
  if (email && email !== body.email) {
    sendEmail(CommentReply, {
      to: email,
      title: `@${body.nickname} 回复了您的评论`,
      props: {
        content: body.content,
        path,
      },
    });
  }
});
