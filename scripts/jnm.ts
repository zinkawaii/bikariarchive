import { writeFile } from "node:fs/promises";
import { resolve } from "pathe";

const url = "https://namaemaker.net/wp-content/cache/autoptimize/autoptimize_single_4e118ae6b0f62cbfd6a1c0b41283e2c2.php";
const res = await fetch(url);
const text = await res.text();

const Jnm = {};

const reg = /randWordJnm(?<order>\d+(?:_kana)?)=new Array\((?<items>.*?)\)/g;
for (const match of text.matchAll(reg)) {
    const { order, items } = match.groups!;
    Jnm[order] = items.split(",").map((item) => item.slice(1, -1));
}

const outputPath = resolve(import.meta.dirname, "../public/json/Jnm.json");
await writeFile(outputPath, JSON.stringify(Jnm, null, 2));
