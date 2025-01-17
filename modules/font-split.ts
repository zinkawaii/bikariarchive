import { fontSplit } from "cn-font-split";
import fs from "fs-extra";
import { defineNuxtModule, resolvePath } from "nuxt/kit";
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
        configKey: "splittedFonts"
    },
    defaults: {
        fonts: []
    },
    async setup(options, nuxt) {
        for (const font of options.fonts) {
            const fontPath = await resolvePath(font.path);
            const fontName = font.name.replaceAll(/\s+/g, "_");
            const dirName = `node_modules/.cache/${cacheName}/${fontName}`;
            const cssName = "index.css";

            if (!await fs.pathExists(dirName)) {
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
                        localFamily: []
                    }
                });
            }

            nuxt.options.css.push(resolve(dirName, cssName));
        }
    }
});