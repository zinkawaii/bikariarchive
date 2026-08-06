import { type } from "arktype";
import { getQuery, HTTPError } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";
import type { Root } from "@bikari/article";
import { Article } from "#shared/utils/article";

export type GetArticleQuery = typeof schema.inferIn;

export interface GetArticleResponse {
  body: Root;
  token: string;
}

const schema = type({
  novel: "string",
  index: "string",
  password: "string",
});

export default defineJEventHandler<{
  query: GetArticleQuery;
}, GetArticleResponse>(async (event, res) => {
  const config = useRuntimeConfig();
  const { novel, index, password } = schema.assert(getQuery(event));

  // 初始化
  const art = Article.for(novel, index);
  if (!art) {
    throw HTTPError.status(404);
  }

  // 验证密码
  if (art.encrypted && password !== Article.serverInfo(art).password) {
    throw HTTPError.status(403);
  }

  // 连接数据库
  await connectMongoose();

  // 读取文章
  res.body = await readArticle(art);

  // 生成代币
  const token = {
    novel,
    index,
  };

  res.token = encryptArticleToken(token, config.article.key);
});
