import { createHash } from "node:crypto";
import { type } from "arktype";
import { parsePath, withoutTrailingSlash } from "ufo";
import type { H3Event } from "nitro/h3";
import CommentReply from "#server/emails/comment-reply.vue";

// 无尾斜杠路径
export const parseCommentPath = type(/^\//).pipe(
  (path) => withoutTrailingSlash(parsePath(path).pathname),
);

// 发送回复邮件
export function sendReplyEmail(event: H3Event, comment: CommentDataSchema, parent: CommentDataSchema | null) {
  if (parent?.email !== void 0 && parent.email !== comment.email) {
    const task = sendEmail(CommentReply, {
      to: parent?.email,
      title: `@${comment.nickname} 回复了您的评论`,
      props: {
        content: comment.content,
        path: comment.path,
      },
    });
    event.waitUntil(task);
  }
}

// 从邮箱生成头像链接
export function generateAvatarUrl(email: string) {
  const hash = createHash("sha256").update(email.toLowerCase()).digest("hex");
  return `https://weavatar.com/avatar/${hash}?d=404`;
}
