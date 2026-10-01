import { join } from "pathe";
import { createArticle } from "../src/index.ts";
import { isDevelopment } from "../src/utils.ts";

const article = createArticle(join(import.meta.dirname, "../../.."));
await article.build();

isDevelopment && article.watch();
