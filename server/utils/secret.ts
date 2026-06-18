import { randomUUID } from "node:crypto";
import { MD5 } from "crypto-es";

//输入字符串（密码），生成返回哈希和盐值
export function createSecret(str: string) {
  const salt = MD5(randomUUID()).toString();
  const hash = MD5(MD5(str) + salt).toString();
  return {
    hash,
    salt,
  };
}

//输入字符串（密码）和盐值，返回哈希用于校验
export function encryptSecret(str: string, salt: string) {
  const hash = MD5(MD5(str) + salt).toString();
  return hash;
}
