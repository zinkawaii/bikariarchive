import { addTemplate, defineNuxtModule } from "@nuxt/kit";
import { capitalize, hyphenate } from "@vue/shared";

const easings = {
  inBack: "0.6, -0.28, 0.735, 0.045",
  outBack: "0.175, 0.885, 0.32, 1.275",
  inCubic: "0.55, 0.055, 0.675, 0.19",
  outCubic: "0.215, 0.61, 0.355, 1",
};

export default defineNuxtModule({
  meta: {
    name: "@bikari/easings",
  },
  setup(options, nuxt) {
    nuxt.options.css.unshift("#build/easings.css");

    addTemplate({
      filename: "easings.css",
      getContents: () => /* CSS */`
:root {
${Object.entries(easings)
  .map(([key, val]) => `  --ease-${hyphenate(key)}: cubic-bezier(${val});`)
  .join("\n")}
}
`.trimStart(),
    });

    addTemplate({
      filename: "easings.mjs",
      getContents: () => /* TS */`
${Object.entries(easings)
  .map(([key, val]) => `export const ease${capitalize(key)} = \`cubic-bezier(${val})\`;`)
  .join("\n")}
`.trimStart(),
    });

    addTemplate({
      filename: "easings.d.ts",
      write: true,
      getContents: () => /* TS */`
${Object.keys(easings)
  .map((key) => `export declare const ease${capitalize(key)}: string;`)
  .join("\n")}
`.trimStart(),
    });
  },
});
