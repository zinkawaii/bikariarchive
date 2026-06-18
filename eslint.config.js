import zin from "@zinkawaii/eslint-config";

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
);
