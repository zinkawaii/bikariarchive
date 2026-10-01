import article from "./collections/article.ts";
import entry from "./collections/entry.ts";
import update from "./collections/update.ts";
import { createKerria } from "./processor/kerria.ts";

export * from "./config.ts";
export * from "./markdown/index.ts";
export * from "./markdown/types.ts";
export * from "./types/article.ts";
export * from "./types/entry.ts";
export * from "./types/intel.ts";
export * from "./types/update.ts";

export function createArticle(base: string) {
  return createKerria(base, [article, entry, update]);
}
