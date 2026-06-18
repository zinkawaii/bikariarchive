import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import consola from "consola";
import { addTemplate, defineNuxtModule } from "nuxt/kit";
import { join } from "pathe";

const name = "@bikari/namaemaker";
const cacheName = name.replaceAll("/", "+");

export default defineNuxtModule({
  meta: {
    name,
  },
  async setup(options, nuxt) {
    const cacheDir = join(nuxt.options.rootDir, `node_modules/.cache/${cacheName}`);
    const jnmPath = join(cacheDir, "jnm.json");

    if (!existsSync(jnmPath)) {
      const url = await fetch("https://namaemaker.net/archives/japanese-name.html")
        .then((res) => res.text())
        .then((text) => text.match(/src="([^"]*load_Jnm[^"]*.js)"/)![1]);

      const res = await fetch(url);
      const text = await res.text();
      const entityRE = /randWordJnm(?<order>\d+(?:_kana)?)=new Array\((?<items>.*?)\)/g;

      const Jnm = Object.fromEntries(
        Array.from(text.matchAll(entityRE), (match) => {
          const { order, items } = match.groups!;
          return [order, items.split(",").map((item) => item.slice(1, -1))];
        }),
      );

      await mkdir(cacheDir, { recursive: true });
      await writeFile(jnmPath, JSON.stringify(Jnm));
      consola.success("[Namaemaker] Fetch");
    }

    addTemplate({
      filename: "namaemaker.mjs",
      getContents: () => /* TS */`
export const load = () => import("${jnmPath}").then((m) => m.default);
`.trimStart(),
    });

    addTemplate({
      filename: "namaemaker.d.ts",
      write: true,
      getContents: () => /* TS */`
export const load: () => Promise<Record<string, string[]>>;
`.trimStart(),
    });
  },
});
