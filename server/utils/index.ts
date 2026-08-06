import { createHash } from "node:crypto";
import { type } from "arktype";
import { parsePath, withoutTrailingSlash } from "ufo";

// 无尾斜杠路径
export const parseCommentPath = type(/^\//).pipe(
  (path) => withoutTrailingSlash(parsePath(path).pathname),
);

// 从邮箱生成头像链接
export function generateAvatarUrl(email: string) {
  const hash = createHash("sha256").update(email.toLowerCase()).digest("hex");
  return `https://weavatar.com/avatar/${hash}?d=404`;
}
