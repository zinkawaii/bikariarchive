import { type } from "arktype";
import { AwsClient } from "aws4fetch";
import { getQuery, getRouterParam, redirect } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";

export type GetImageQuery = typeof schema.inferIn;

const schema = type({
  fmt: "string?",
  q: "string?",
  w: "string?",
  h: "string?",
});

export default defineJEventHandler<{
  query: GetImageQuery;
}>(async (event) => {
  const config = useRuntimeConfig();
  const query = schema.assert(getQuery(event));
  const slug = getRouterParam(event, "slug");

  if (slug === void 0) {
    throw 1;
  }

  const s3 = new AwsClient({
    accessKeyId: config.bitiful.accessKey,
    secretAccessKey: config.bitiful.secretKey,
    service: "s3",
    region: "cn-east-1",
  });

  const url = new URL(`https://${config.bitiful.bucket}.s3.bitiful.net/image/${slug}`);

  for (const [key, value] of Object.entries(query)) {
    if (value !== void 0) {
      url.searchParams.set(key, value);
    }
  }
  // 之后在图床上传原图后再启用这段代码
  // const fmt = query.fmt ?? (event.req.headers.get("accept")?.includes("image/avif") ? "avif" : "webp");
  // url.searchParams.set("fmt", fmt);
  url.searchParams.set("X-Amz-Expires", "3600");

  const request = await s3.sign(url, {
    aws: {
      signQuery: true,
    },
  });

  return redirect(request.url, 307);
});
