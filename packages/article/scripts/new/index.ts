import * as p from "@clack/prompts";
import pc from "picocolors";
import packageJson from "../../package.json" with { type: "json" };
import { createArticle } from "./article.ts";

process.on("exit", () => {
    p.outro();
});

p.intro(pc.bgBlue(` ${packageJson.name} `));

createArticle();
