import { existsSync } from "node:fs";
import { fontSplit } from "cn-font-split";
import { addPluginTemplate, defineNuxtModule, resolvePath } from "nuxt/kit";
import { resolve } from "pathe";

interface FontSplitOptions {
    fonts?: FontInfo[];
}

interface FontInfo {
    name: string;
    path: string;
}

const name = "@bikari/font-split";
const cacheName = name.replaceAll("/", "+");

export default defineNuxtModule<FontSplitOptions>({
    meta: {
        name,
        configKey: "splittedFonts",
    },
    defaults: {
        fonts: [],
    },
    async setup(options) {
        const paths: string[] = [];

        for (const font of options.fonts!) {
            const fontPath = await resolvePath(font.path);
            const fontName = font.name.replaceAll(/\s+/g, "_");
            const dirName = `node_modules/.cache/${cacheName}/${fontName}`;
            const cssName = "index.css";

            if (!existsSync(dirName)) {
                fontSplit({
                    input: fontPath,
                    outDir: dirName,
                    multiThreads: true,
                    testHtml: false,
                    reporter: false,
                    renameOutputFont: `[hash:8].[ext]`,
                    css: {
                        fileName: cssName,
                        fontFamily: font.name,
                        localFamily: [],
                    },
                });
            }
            paths.push(resolve(dirName, cssName));
        }

        addPluginTemplate({
            filename: "font-split.client.mjs",
            getContents: () => /* TS */`
${paths.map((path, i) => `import css${i} from "${path}?url";`).join("\n")}

export default defineNuxtPlugin(() => {
    for (const css of [${paths.map((path, i) => `css${i}`)}]) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = css;
        document.head.appendChild(link);
    }
});
`.trimStart(),
        });
    },
});
