import { styleText } from "node:util";
import * as p from "@clack/prompts";
import packageJson from "../../package.json" with { type: "json" };
import { createArticle } from "./article";

process.on("exit", () => {
    p.outro();
});

p.intro(styleText("bgBlue", ` ${packageJson.name} `));

createArticle();
