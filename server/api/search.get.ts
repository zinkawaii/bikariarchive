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
    SELECT
      selected.novel,
      selected.chapter,
      selected.count,
      (
        SELECT json_group_array(json(search.children))
        FROM search
        WHERE search.novel = selected.novel
          AND search.chapter = selected.chapter
          AND search.sequence BETWEEN selected.sequence - 1 AND selected.sequence + 1
        ORDER BY search.sequence
      ) AS parts
    FROM (
      SELECT
        novel,
        chapter,
        min(sequence) AS sequence,
        sum((length(content) - length(replace(content, ?, ''))) / length(?)) AS count
      FROM search
      WHERE instr(content, ?) > 0 AND (? IS NULL OR novel = ?)
      GROUP BY novel, chapter
    ) AS selected
    ORDER BY selected.novel, selected.chapter
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
