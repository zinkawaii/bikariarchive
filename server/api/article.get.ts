import { type } from "arktype";
import { defineHandler } from "nitro";
import { createError, getValidatedQuery, useRuntimeConfig } from "nuxt/server";
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

export default defineHandler<{ query: GetArticleQuery }, Promise<GetArticleResponse>>(async (event) => {
  const config = useRuntimeConfig();
  const query = await getValidatedQuery(event, schema);

  // 初始化
  const art = Article.for(query.novel, query.index);
  if (!art) {
    throw createError({ status: 404 });
  }

  // 验证密码
  if (art.encrypted && query.password !== Article.serverInfo(art).password) {
    throw createError({ status: 403 });
  }

  // 连接数据库
  await connectMongoose();

  // 读取文章
  const body = await readArticle(art);

  // 生成代币
  const token = {
    novel: query.novel,
    index: query.index,
  };

  return {
    body,
    token: encryptArticleToken(token, config.article.key),
  };
});
