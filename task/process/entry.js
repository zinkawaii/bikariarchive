import chokidar from "chokidar";
import fs from "fs-extra";
import * as path from "path";
import { r, timer } from "./utils.js";

const category = [
    "area",
    "character",
    "concept"
];

const srcDir = r("assets/json/Entry.json");
const outDir = r("dist/json/Entry.json");

const jEntry = JSON.parse(fs.readFileSync(srcDir));

timer("Entry", () => {
    jEntry.category = {};

    category.forEach((str) => {
        jEntry.category[str] = [];

        const filenames = fs.readdirSync(r(`data/${str}`));
        filenames.forEach((filename) => {
            const name = path.basename(filename, ".json");
            jEntry.category[str].push(name);
        });
    });

    fs.outputFileSync(outDir, JSON.stringify(jEntry));
})();