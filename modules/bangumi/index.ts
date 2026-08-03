import { mkdir, readFile, writeFile } from "node:fs/promises";
import { addTemplate, defineNuxtModule } from "@nuxt/kit";
import { fetchFullSubjects } from "bgmt/cdn";
import consola from "consola";
import { join, relative } from "pathe";
import { ids } from "./meta.ts";

interface Options {
  sizes?: number;
}

const name = "@bikari/bangumi";
const cacheName = name.replaceAll("/", "+");

export default defineNuxtModule<Options>({
  meta: {
    name,
  },
  defaults: {
    sizes: 24,
  },
  async setup(options, nuxt) {
    const cacheDir = join(nuxt.options.rootDir, `node_modules/.cache/${cacheName}`);
    const chunksDir = join(cacheDir, "chunks");

    const idsPath = join(cacheDir, "ids.json");
    const cacheIds = new Set(
      await readFile(idsPath, "utf-8").then(JSON.parse).catch(() => []),
    );

    const pages = Math.ceil(ids.size / options.sizes!);

    if (ids.difference(cacheIds).size + cacheIds.difference(ids).size) {
      const fetched = await fetchFullSubjects();
      const bangumis = fetched.subjects
        .filter(({ id }) => ids.has(id))
        .map((item) => {
          const poster = new URL(item.poster);
          return {
            id: item.id,
            title: {
              ja: item.alias.ja?.[0],
              zh: item.alias.zh?.[0],
            },
            cover: poster.origin + "/r/400" + poster.pathname,
            date: item.onair_date,
          };
        })
        .sort((a, b) => a.date && b.date?.localeCompare(a.date) || a.id - b.id);

      await mkdir(chunksDir, { recursive: true });
      const writes = [
        writeFile(idsPath, JSON.stringify([...ids])),
      ];

      for (let i = 0; i < pages; i++) {
        const chunk = bangumis.slice(i * options.sizes!, (i + 1) * options.sizes!);
        const chunkPath = join(chunksDir, `${i + 1}.json`);
        writes.push(writeFile(chunkPath, JSON.stringify(chunk)));
      }

      await Promise.all(writes);
      consola.success("[Bangumi] Fetch");
    }

    const relativeDir = relative(nuxt.options.buildDir, chunksDir);
    addTemplate({
      filename: "bangumi.mjs",
      getContents: () => /* TS */`
export const total = ${ids.size};
export const sizes = ${options.sizes};
export const chunks = {${Array.from({ length: pages }, (_, i) => `
  ${i + 1}: () => import("${join(relativeDir, `${i + 1}.json`)}").then((m) => m.default)`)}
};
`.trimStart(),
    });

    addTemplate({
      filename: "bangumi.d.ts",
      write: true,
      getContents: () => /* TS */`
export interface Bangumi {
  id: number;
  title: {
    ja: string;
    zh: string;
  };
  cover: string;
  date: string;
}

export const total: number;
export const sizes: number;
export const chunks: Record<number, () => Promise<Bangumi[]>>;
`.trimStart(),
    });
  },
});
