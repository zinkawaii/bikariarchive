import { styleText } from "node:util";
import * as p from "@clack/prompts";
import packageJson from "../../package.json" with { type: "json" };
import { createArticle } from "./article.ts";

process.on("exit", () => {
  p.outro();
});

p.intro(styleText("bgBlue", ` ${packageJson.name} `));

createArticle();
