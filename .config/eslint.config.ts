import zin from "@zinkawaii/eslint-config";
import css from "@zinkawaii/eslint-config-css";

export default zin(
  {
    rules: {
      "vue/block-tag-newline": ["warn", {
        blocks: {
          article: {
            maxEmptyLines: 1,
          },
        },
      }],
    },
  },
  {
    files: [
      "./app/pages/**/*.vue",
    ],
    rules: {
      "vue/valid-v-slot": "off",
    },
  },
  {
    files: [
      "./server/api/**/*.ts",
    ],
    rules: {
      "no-throw-literal": "off",
    },
  },
  {
    files: [
      "./content/{area,character,concept}/**/*.md",
    ],
    rules: {
      "markdown/no-multiple-h1": "off",
    },
  },
).append(css).setDefaultIgnores((prev) => [...prev, "**/*.css"]);
