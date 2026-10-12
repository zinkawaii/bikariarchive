import { copyFile } from "node:fs/promises";
import { createArticle } from "@bikari/article";
import { defu } from "defu";
import { addComponent, addNitroPlugin, addPlugin, addTemplate, addVitePlugin, createResolver, defineNuxtModule } from "nuxt/kit";
import { join, relative } from "pathe";
import configLiteral from "./config.ts";
import vite from "./vite.ts";

// 将字面量类型泛化回对应的接口
const config = configLiteral as import("@bikari/article").Config;

export default defineNuxtModule({
  meta: {
    name: "@bikari/article",
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    addPlugin({ src: resolve("runtime/plugin") });

    addNitroPlugin(resolve("runtime/server/plugin"));

    addVitePlugin(vite, { prepend: true });

    addComponent({
      name: "BikariyaArticle",
      filePath: resolve("runtime/article.vue"),
    });

    const generatedRoot = join(nuxt.options.rootDir, "content/generated");
    const sqliteName = "kerria.sqlite";
    nuxt.options.alias["#content"] = generatedRoot;

    nuxt.hook("nitro:build:before", (nitro) => {
      nitro.options.database = {
        ...nitro.options.database,
        content: {
          connector: "sqlite",
          options: {
            path: join(nitro.options.output?.serverDir ?? generatedRoot, sqliteName),
          },
        },
      };
    });

    nuxt.hook("nitro:build:public-assets", async (nitro) => {
      if (nitro.options.output) {
        await copyFile(
          join(generatedRoot, sqliteName),
          join(nitro.options.output.serverDir, sqliteName),
        );
      }
    });

    nuxt.options.typescript.appTsConfig = defu(nuxt.options.typescript.appTsConfig, {
      compilerOptions: {
        plugins: [
          {
            name: "@bikari/typescript-plugin",
            ...config,
          },
        ],
      },
      vueCompilerOptions: {
        plugins: [
          {
            name: relative(nuxt.options.buildDir, resolve("volar.cts")),
          },
        ],
      },
      include: [
        "../content/**/*.md",
      ],
    });

    const article = createArticle(nuxt.options.rootDir);
    await article.build();

    if (nuxt.options.dev) {
      nuxt.hook("close", article.watch());
    }

    addTemplate({
      filename: "article.mjs",
      getContents() {
        const all = new Set(config.components);
        for (const mapping of config.mappings) {
          if (mapping.components?.length) {
            for (const name of mapping.components) {
              all.add("Lazy" + name);
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
${mapping.components?.map((name) => `    ${name}: Lazy${name},`).join("\n")}
  },`)
  .join("")}
};
`.trimStart();
      },
    });

    addTemplate({
      filename: "article.d.ts",
      getContents: () => /* TS */`
export type Config = typeof import("${relative(nuxt.options.buildDir, resolve("config.ts"))}").default;

export declare const components: {
  global: Pick<typeof import("./components"), ${config.components?.map((name) => `"${name}"`).join(" | ")}>;
${config.mappings.map(
  (mapping) => /* TS */`  ${mapping.name}: Pick<typeof import("./components"), ${
    mapping.components?.map((name) => `"${name}"`).join(" | ") ?? `""`
  }>`,
).join("\n")}
};
`.trimStart(),
    });
  },
});
