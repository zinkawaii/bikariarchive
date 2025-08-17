import { writeFile } from "node:fs/promises";
import { resolve } from "pathe";

const url = await fetch("https://namaemaker.net/archives/japanese-name.html")
    .then((res) => res.text())
    .then((text) => text.match(/src="([^"]*autoptimize[^"]*.php)"/)![1]);

const res = await fetch(url);
const text = await res.text();

const entityRE = /randWordJnm(?<order>\d+(?:_kana)?)=new Array\((?<items>.*?)\)/g;

const Jnm = Object.fromEntries(
    [...text.matchAll(entityRE)].map((match) => {
        const { order, items } = match.groups!;
        return [order, items.split(",").map((item) => item.slice(1, -1))];
    }),
);

const outputPath = resolve(import.meta.dirname, "../public/json/Jnm.json");
await writeFile(outputPath, JSON.stringify(Jnm));
