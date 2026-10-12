import { Buffer } from "node:buffer";
import { createHmac, timingSafeEqual } from "node:crypto";

export function encryptArticleToken(token: Record<string, any>, key: string) {
  const payload = Buffer.from(JSON.stringify(token)).toString("base64url");
  const signature = createHmac("sha256", key).update(payload).digest("base64url");

  return `v1.${payload}.${signature}`;
}

export function decryptArticleToken(token: string, key: string) {
  const [version, payload, signature] = token.split(".");

  if (version !== "v1" || payload === void 0 || signature === void 0) {
    throw new Error("Invalid token");
  }

  const expected = createHmac("sha256", key).update(payload).digest();
  const actual = Buffer.from(signature, "base64url");

  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    throw new Error("Invalid token");
  }

  return JSON.parse(
    Buffer.from(payload, "base64url").toString("utf-8"),
  );
}
