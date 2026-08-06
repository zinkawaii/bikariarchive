import { type } from "arktype";
import { toString } from "mdast-util-to-string";
import { getQuery } from "nitro/h3";
import { useStorage } from "nitro/storage";
import { visit } from "unist-util-visit";
import type { Child, Element, Root } from "@bikari/article";
import { Article } from "#shared/utils/article";

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

export default defineJThrottledEventHandler<{
  query: GetSearchQuery;
}, GetSearchResponse>(async (event, res) => {
  const storage = useStorage("assets:data");
  const query = schema.assert(getQuery(event));

  const code = query.word.codePointAt(0)!.toString();
  const data = await storage
    .getItem(`search/${code.slice(0, 2)}/${code}.json`)
    .catch(() => ({})) as Record<string, number[][]>;

  const novels = new Set(query.novel === void 0 ? Object.keys(Article.meta) : [query.novel]);
  const weakTexts = new WeakMap<Element, string>();

  // 按章节遍历
  res.list = [];

  for (const [uri, vectors] of Object.entries(data)) {
    const [novel, index] = uri.split("/");
    if (!novels.has(novel)) {
      continue;
    }

    const art = Article.for(novel, index);
    const root = await readArticle(art);
    const nodes: Element[] = [];

    for (const vector of vectors) {
      let node: Root | Child = root;
      for (let i = 0; i < vector.length - 1; i++) {
        if (node.type === "text") {
          break;
        }
        node = node.children[vector[i]];
      }

      if (node.type !== "element" || node.tag !== "p") {
        continue;
      }

      let text = weakTexts.get(node);
      if (text === void 0) {
        weakTexts.set(node, text = toString(node));
      }

      if (text.startsWith(query.word, vector.at(-1))) {
        nodes.push(node);
      }
    }

    if (!nodes.length) {
      continue;
    }

    const paragraphs: Element[] = [];
    visit(root, "element", (node) => {
      if (node.tag === "p") {
        paragraphs.push(node);
      }
    });

    const line = paragraphs.findIndex((p) => p === nodes[0]);
    const start = Math.max(line - 1, 0);
    const end = Math.min(line + 2, paragraphs.length);

    res.list.push({
      novel: art.novel,
      index: art.index,
      count: nodes.length,
      parts: Array.from({ length: end - start }, (_, i) => paragraphs[i + start]),
    });
  }
}, 1500);
