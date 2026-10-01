import { createArticle } from "@bikari/article";
import { join } from "pathe";

const article = createArticle(join(import.meta.dirname, ".."));
await article.build();

if (process.env.NODE_ENV === "development") {
  article.watch();
}
