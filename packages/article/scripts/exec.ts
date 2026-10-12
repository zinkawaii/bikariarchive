import { join } from "pathe";
import { createArticle } from "../src/index.ts";

const article = createArticle(join(import.meta.dirname, "../../.."));
await article.build();

if (process.env.NODE_ENV === "development") {
  article.watch();
}
