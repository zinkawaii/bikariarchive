import * as p from "@clack/prompts";
import { createArticle } from "./article.ts";

process.on("exit", () => {
    p.outro();
});

createArticle();
