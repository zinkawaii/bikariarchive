import { resolve } from "node:path";
import { defineNuxtModule, resolvePath } from "nuxt/kit";
import { fontSplit } from "@konghayao/cn-font-split";
import { pathExists } from "fs-extra";

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

            if (!await pathExists(dirName)) {
                fontSplit({
                    FontPath: fontPath,
                    destFold: dirName,
                    chunkSize: 70 * 1024,
                    previewImage: null,
                    testHTML: false,
                    reporter: false,
                    threads: {},
                    targetType: "ttf",
                    renameOutputFont: `[hash:8][ext]`,
                    cssFileName: cssName,
                    css: {
                        fontFamily: font.name,
                        localFamily: false
                    }
                });
            }

            nuxt.options.css.push(resolve(dirName, cssName));
        }
    }
});