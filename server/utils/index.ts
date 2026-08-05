import { createHash } from "node:crypto";
import { parsePath } from "ufo";

// 获取无尾斜杠路径
export function getStrictPath(path: string) {
  return parsePath(path).pathname.replace(/\/$/, "");
}

// 从邮箱生成头像链接
export function generateAvatarUrl(email: string) {
  const hash = createHash("sha256").update(email.toLowerCase()).digest("hex");
  return `https://weavatar.com/avatar/${hash}?d=404`;
}
