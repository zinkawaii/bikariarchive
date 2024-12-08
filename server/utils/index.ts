import CryptoES from "crypto-es";
import { resolve } from "pathe";

//从根目录合并路径
export function r(path: string) {
    return resolve("." + path);
}

//获取无尾斜杠路径
export function getStrictPath(path: string) {
    return path.split("?")[0].split("#")[0].replace(/[\\/]+$/, "");
}

//从邮箱生成头像链接
export function generateAvatarUrl(email?: string) {
    const hash = email ? CryptoES.SHA256(email.toLocaleLowerCase()) : "";
    return `https://weavatar.com/avatar/${hash}?d=404`;
}