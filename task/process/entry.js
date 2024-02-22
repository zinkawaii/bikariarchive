import chokidar from "chokidar";
import fs from "fs-extra";
import * as path from "path";
import { r, timer } from "../utils.js";

const folders = [
    "area",
    "character",
    "concept"
];

const metaSrcDir = r("assets/json/Entry.json");
const metaOutDir = r("dist/json/Entry.json");
const mapOutDir = r("dist/json/Entrimap.json");

const jEntry = JSON.parse(fs.readFileSync(metaSrcDir));
const jMap = {};

timer("Entry", () => {
    jEntry.all = [];

    folders.forEach((category) => {
        const filenames = fs.readdirSync(r(`data/${category}`));
        filenames.forEach((filename) => {
            const name = path.basename(filename, ".json");
            jEntry.all.push(name);
            jMap[name] = category;
        });
    });

    fs.outputFileSync(metaOutDir, JSON.stringify(jEntry));
    fs.outputFileSync(mapOutDir, JSON.stringify(jMap));
})();