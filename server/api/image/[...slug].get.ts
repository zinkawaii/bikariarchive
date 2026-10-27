import { type } from "arktype";
import { AwsV4Signer } from "aws4fetch";
import { defineHandler } from "nitro";
import { createError, getRouterParam, getValidatedQuery, sendRedirect, useRuntimeConfig } from "nuxt/server";

export type GetImageQuery = typeof schema.inferIn;

const schema = type({
  fmt: "string?",
  q: "string?",
  w: "string?",
  h: "string?",
});

const maxAge = 3600;

export default defineHandler<{ query: GetImageQuery }>(async (event) => {
  const config = useRuntimeConfig();
  const query = await getValidatedQuery(event, schema);
  const slug = getRouterParam(event, "slug");

  if (slug === void 0) {
    throw createError({ status: 404 });
  }

  const url = new URL(`https://${config.bitiful.bucket}.s3.bitiful.net/image/${slug}`);

  for (const [key, value] of Object.entries(query)) {
    if (value !== void 0) {
      url.searchParams.set(key, value);
    }
  }
  // 之后在图床上传原图后再启用这段代码
  // const fmt = query.fmt ?? (event.req.headers.get("accept")?.includes("image/avif") ? "avif" : "webp");
  // url.searchParams.set("fmt", fmt);
  url.searchParams.set("X-Amz-Expires", maxAge.toString());
  url.searchParams.set("response-cache-control", `public, max-age=${maxAge}`);

  const signer = new AwsV4Signer({
    url: url.toString(),
    accessKeyId: config.bitiful.accessKey,
    secretAccessKey: config.bitiful.secretKey,
    service: "s3",
    region: "cn-east-1",
    signQuery: true,
  });
  const signed = await signer.sign();

  // FIXME: 完全一致的 `maxAge` 可能在极端情况下出现缓存失效
  event.res.headers.set("cache-control", `public, max-age=${maxAge}`);

  return sendRedirect(event, signed.url.toString(), 307);
});
