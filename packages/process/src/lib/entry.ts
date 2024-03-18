import * as path from "path";
import Processor from "./processor";

const folders = [
    "area",
    "character",
    "concept"
];

export default new Processor({
    sign: "Entry",
    source: {
        src: "data",
        out: "dist",
        pattern: `{${folders.join(",")}}/*.md`
    },
    meta: {
        src: "assets/json/Entry.json",
        out: "dist/json/Entry.json"
    },
    map: {
        out: "dist/json/Entrimap.json"
    },
    generate(filelist) {
        this.jMeta.all = [];

        for (const filename of filelist) {
            const name = path.basename(filename, ".md");
            this.jMeta.all.push(name);

            for (const folder of folders) {
                if (filename.includes(folder)) {
                    this.jMap[name] = folder;
                    break;
                }
            }
        }
    },
    parse(filename: string) {

    }
});