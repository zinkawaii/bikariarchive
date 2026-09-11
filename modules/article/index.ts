import { article, entry, update } from "@bikari/article";
import { addPlugin, addServerPlugin, addTemplate, addVitePlugin, createResolver, defineNuxtModule } from "@nuxt/kit";
import { join, relative } from "pathe";
import config from "./config.ts";
import { buildSearch } from "./search.ts";
import vite from "./vite.ts";

export default defineNuxtModule({
  meta: {
    name: "@bikari/article",
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    addPlugin({ src: resolve("runtime/client") });

    addServerPlugin(resolve("runtime/server"));

    addVitePlugin(vite, { prepend: true });

    nuxt.options.alias["#data"] = join(nuxt.options.rootDir, ".data");

    (nuxt.options.nitro.serverAssets ??= []).push({
      baseName: "data",
      dir: ".data",
      pattern: "{json,novel,search}/**/*.json",
    });

    ((nuxt.options.typescript.tsConfig.vueCompilerOptions ??= {}).plugins ??= []).push({
      name: relative(nuxt.options.buildDir, resolve("volar.cts")),
    });

    const disposables: (() => Promise<unknown>)[] = [];
    for (const processor of [article, entry, update]) {
      await processor.build();
      if (nuxt.options.dev) {
        disposables.push(processor.watch());
      }
    }
    await buildSearch();

    nuxt.hook("close", async () => {
      await Promise.all(disposables.map((dispose) => dispose()));
    });

    addTemplate({
      filename: "tsconfig.article.json",
      write: true,
      getContents: () => JSON.stringify({
        extends: "@zinkawaii/tsconfig",
        compilerOptions: {
          plugins: [
            {
              name: "@bikari/typescript-plugin",
              ...config,
            },
          ],
        },
        include: [
          "../content/**/*.md",
        ],
      }, void 0, 2),
    });

    addTemplate({
      filename: "article.mjs",
      write: true,
      getContents() {
        const all = new Set(config.components);
        for (const mapping of config.mappings) {
          if (mapping.components?.length) {
            for (const name of mapping.components) {
              all.add(name);
            }
          }
        }
        return /* TS */`
import { ${[...all].join(", ")} } from "#components";

export const components = {
  global: {
${config.components?.map((name) => `    ${name},`).join("\n")}
  },
${config.mappings
  .filter((mapping) => mapping.components?.length)
  .map((mapping) => /* TS */`  ${mapping.name}: {
${mapping.components?.map((name) => `    ${name},`).join("\n")}
  },`)
  .join("")}
};
`.trimStart();
      },
    });
  },
});
