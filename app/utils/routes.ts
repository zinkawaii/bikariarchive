import type { RouteLocationRaw } from "vue-router";

//路由：词条
export function toEntry(title: string): RouteLocationRaw {
  return {
    name: "entry",
    params: { title },
  };
}

//路由：全文检索
export function toSearch(word: string): RouteLocationRaw {
  return {
    name: "search",
    query: { word },
  };
}
