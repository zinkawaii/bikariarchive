import { type } from "arktype";
import { getRequestIP, HTTPError } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";
import { ReadRecordModel } from "#server/models/ReadRecord";

export type PatchArticleBody = typeof schema.inferIn;

export interface PatchArticleResponse {
  count: number;
}

const schema = type({
  token: "string",
});

export default defineJEventHandler<{
  body: PatchArticleBody;
}, PatchArticleResponse>(async (event, res) => {
  const config = useRuntimeConfig();
  const { token } = schema.assert(await event.req.json());

  // 连接数据库
  await connectMongoose();

  let novel: string;
  let index: string;

  try {
    const parsed = decryptArticleToken(token, config.article.key);
    novel = parsed.novel;
    index = parsed.index;
  }
  catch {
    throw HTTPError.status(400);
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
  const qCounts = await ReadRecordModel.aggregate<{ count: number }>([
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

  res.count = qCounts.length ? qCounts[0].count : 0;
});
