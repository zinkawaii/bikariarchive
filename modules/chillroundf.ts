import { createWriteStream, existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { addPluginTemplate, defineNuxtModule } from "@nuxt/kit";
import consola from "consola";
import { join } from "pathe";

interface FontSplitOptions {
  fonts?: FontInfo[];
}

interface FontInfo {
  name: string;
  path: string;
}

const name = "@bikari/chillroundf";
const cacheName = name.replaceAll("/", "+");

export default defineNuxtModule<FontSplitOptions>({
  meta: {
    name,
  },
  async setup() {
    const cacheDir = `node_modules/.cache/${cacheName}`;

    if (!existsSync(cacheDir)) {
      const originalName = "寒蝉全圆体";
      const standardName = "ChillRoundF";
      const cssUrl = "https://esm.sh/@chinese-fonts/hcqyt/dist/ChillRoundFRegular/result.css";
      const css = await fetch(cssUrl).then((res) => res.text());

      const fileName = join(cacheDir, "result.css");
      await mkdir(cacheDir, { recursive: true });
      await writeFile(fileName, css.replaceAll(originalName, standardName));

      await Promise.all(
        css.matchAll(/url\("(.*?)"\)/g).map(async (match) => {
          const relativePath = match[1];
          const url = join(cssUrl, "..", relativePath);
          const res = await fetch(url);

          const fileName = join(cacheDir, relativePath);
          const stream = createWriteStream(fileName);
          return pipeline(res.body!, stream);
        }),
      );

      consola.success(`[ChillRoundF] Fetch`);
    }

    addPluginTemplate({
      filename: "chillroundf.client.mjs",
      getContents: () => /* TS */`
import css from "~~/${cacheDir}/result.css?url";

export default defineNuxtPlugin(() => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.crossOrigin = "";
  link.href = css;
  document.head.appendChild(link);
});
`.trimStart(),
    });
  },
});
