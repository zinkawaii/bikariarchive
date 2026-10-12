import { type } from "arktype";
import { defineHandler } from "nitro";
import { useDatabase } from "nitro/database";
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
  const db = useDatabase("content");
  const query = await getValidatedQuery(event, schema);

  // 初始化
  const art = Article.for(query.novel, query.index);
  if (!art) {
    throw createError({ status: 404 });
  }

  // 验证密码
  if (art.encrypted) {
    const password = await db.prepare(/* SQL */`
      SELECT password
      FROM article
      WHERE novel = ? AND chapter = ?
    `).get(art.novel, art.index).then(
      (row: { password: string }) => row.password,
    );

    if (query.password !== password) {
      throw createError({ status: 403 });
    }
  }

  // 读取文章
  const body = await db.prepare(/* SQL */`
    SELECT body
    FROM article
    WHERE novel = ? AND chapter = ?
  `).get(art.novel, art.index).then<Root>(
    (row: { body: string }) => JSON.parse(row.body),
  );

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
