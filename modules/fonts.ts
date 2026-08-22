import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { addPluginTemplate, defineNuxtModule, setGlobalHead } from "@nuxt/kit";
import consola from "consola";
import { join } from "pathe";

interface FontInfo {
  standardName: string;
  path: string;
}

const name = "@bikari/fonts";
const cacheName = name.replaceAll("/", "+");

const fonts: FontInfo[] = [
  {
    standardName: "Inter",
    path: "/npm/inter-ui@4.1.1/inter-variable.css",
  },
  {
    standardName: "ChillRoundF",
    path: "/npm/@chinese-fonts/hcqyt@2.0.0/dist/ChillRoundFRegular/result.css",
  },
  {
    standardName: "JetBrain Mono",
    path: "/npm/@fontsource/jetbrains-mono@5.3.0/400.css",
  },
  {
    standardName: "Katex",
    path: "/npm/katex@0.18.4/dist/katex.min.css",
  },
];

export default defineNuxtModule({
  meta: {
    name,
  },
  async setup() {
    const cdnUrl = "https://s4.zstatic.net";
    const cacheDir = `node_modules/.cache/${cacheName}`;

    for (const { standardName, path } of fonts) {
      const targetPath = join(cacheDir, `${standardName}.css`);
      if (existsSync(targetPath)) {
        continue;
      }

      const cssUrl = new URL(path, cdnUrl);
      const css = await fetch(cssUrl).then((res) => res.text());

      await mkdir(cacheDir, { recursive: true });
      await writeFile(
        targetPath,
        css.replaceAll(/(?<=url\((['"]?))[^'"]*?(?=\1\))/g, (url) => new URL(url, cssUrl).toString()),
      );

      consola.success(`[Fonts] Fetch (${standardName})`);
    }

    setGlobalHead({
      link: [
        { rel: "preconnect", href: cdnUrl, crossorigin: "" },
      ],
    });

    addPluginTemplate({
      filename: "fonts.client.mjs",
      getContents: () => /* TS */`
${fonts.map(({ standardName }, i) => `import css${i} from "~~/${cacheDir}/${standardName}.css?url";`).join("\n")}

export default defineNuxtPlugin(() => {
  const hrefs = [${fonts.map((font, i) => `css${i}`)}];
  for (let i = 0; i < hrefs.length; i++) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.crossOrigin = "";
    link.href = hrefs[i];
    document.head.appendChild(link);
  }
});
`.trimStart(),
    });
  },
});
