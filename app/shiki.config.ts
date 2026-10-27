import { transformerRenderIndentGuides } from "@shikijs/transformers";
import type { Element } from "hast";
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
      root(root) {
        const pre = root.children[0] as Element;
        const code = pre.children[0] as Element;
        return {
          type: "root",
          children: code.children,
        };
      },
    },
  ],
});
