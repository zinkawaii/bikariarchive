import { type } from "arktype";
import { useDatabase } from "nitro/database";
import { getValidatedQuery } from "nuxt/server";
import type { Child, Element } from "@bikari/article";

export type GetSearchQuery = typeof schema.inferIn;

export interface GetSearchResponse {
  list: SearchResult[];
}

export interface SearchResult {
  novel: string;
  index: string;
  count: number;
  parts: Element[];
}

const schema = type({
  novel: "string?",
  word: "0 < string <= 64",
});

export default defineJThrottledHandler<{ query: GetSearchQuery }, Promise<GetSearchResponse>>(async (event) => {
  const db = useDatabase("content");
  const query = await getValidatedQuery(event, schema);

  const rows = await db.prepare(/* SQL */`
    WITH matched AS (
      SELECT
        search.article_key,
        min(search.sequence) AS sequence,
        sum(
          (length(search.content) - length(replace(search.content, ?, ''))) / length(?)
        ) AS count
      FROM search
      JOIN article ON article.key = search.article_key
      WHERE instr(search.content, ?) > 0 AND (? IS NULL OR article.novel = ?)
      GROUP BY search.article_key
    )
    SELECT
      article.novel,
      article.chapter,
      matched.count,
      (
        SELECT json_group_array(json(search.children))
        FROM search
        WHERE search.article_key = matched.article_key
          AND search.sequence BETWEEN matched.sequence - 1 AND matched.sequence + 1
        ORDER BY search.sequence
      ) AS parts
    FROM matched
    JOIN article ON article.key = matched.article_key
    ORDER BY article.novel, article.chapter
  `).all(
    query.word,
    query.word,
    query.word,
    query.novel ?? null,
    query.novel ?? null,
  ) as {
    novel: string;
    chapter: string;
    count: number;
    parts: string;
  }[];

  return {
    list: rows.map(({ novel, chapter, count, parts }) => ({
      novel,
      index: chapter,
      count,
      parts: JSON.parse(parts).map((children: Child[]) => ({
        type: "element",
        tag: "p",
        props: {},
        children,
      })),
    })),
  };
}, 1500);
