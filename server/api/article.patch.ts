import { type } from "arktype";
import { defineHandler } from "nitro";
import { createError, getRequestIP, readValidatedBody, useRuntimeConfig } from "nuxt/server";
import { ReadRecordModel } from "#server/models/ReadRecord";

export type PatchArticleBody = typeof schema.inferIn;

export interface PatchArticleResponse {
  count: number;
}

const schema = type({
  token: "string",
});

export default defineHandler<{ body: PatchArticleBody }, Promise<PatchArticleResponse>>(async (event) => {
  const config = useRuntimeConfig();
  const body = await readValidatedBody(event, schema);

  // 连接数据库
  await connectMongoose();

  let novel: string;
  let index: string;

  try {
    const parsed = decryptArticleToken(body.token, config.article.key);
    novel = parsed.novel;
    index = parsed.index;
  }
  catch {
    throw createError({ status: 400 });
  }

  const ip = getRequestIP(event, { xForwardedFor: true });
  const time = new Date();

  // 添加阅读记录
  await ReadRecordModel.create({
    ip,
    time,
    novel,
    index,
  });

  // 获取阅读量
  const counts = await ReadRecordModel.aggregate<{ count: number }>([
    {
      $match: {
        novel,
        index,
      },
    },
    {
      $group: {
        _id: {
          ip: "$ip",
          window: {
            $dateTrunc: {
              date: "$time",
              unit: "hour",
              binSize: 8,
            },
          },
        },
      },
    },
    {
      $count: "count",
    },
  ]);

  return {
    count: counts[0]?.count ?? 0,
  };
});
