import { transformerRenderIndentGuides } from "@shikijs/transformers";
import { defineConfig } from "#shiki/config";

export default defineConfig({
    themes: {
        light: () => import("shiki/themes/catppuccin-latte.mjs"),
        dark: () => import("shiki/themes/one-dark-pro.mjs"),
    },
    defaultColor: false,
    transformers: [
        transformerRenderIndentGuides(),
        {
            root: (root) => ({
                type: "root",
                children: (root.children[0] as any).children[0].children,
            }),
        },
    ],
});
