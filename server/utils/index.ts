import { SHA256 } from "crypto-es";
import { resolve } from "pathe";
import { parsePath } from "ufo";

//从根目录合并路径
export function r(path: string) {
    return resolve("." + path);
}

//获取无尾斜杠路径
export function getStrictPath(path: string) {
    return parsePath(path).pathname.replace(/\/$/, "");
}

//从邮箱生成头像链接
export function generateAvatarUrl(email: string) {
    const hash = SHA256(email.toLocaleLowerCase()).toString();
    return `https://weavatar.com/avatar/${hash}?d=404`;
}
