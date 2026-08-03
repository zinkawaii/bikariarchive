import type { NuxtConfig } from "@nuxt/schema";
import type { TSConfig } from "pkg-types";

function shared(): TSConfig["compilerOptions"] {
  return {
    strictFunctionTypes: false,
    noUncheckedIndexedAccess: false,
  };
}

const config: NuxtConfig["typescript"] & Record<"serverTsConfig", TSConfig> = {
  nodeTsConfig: {
    compilerOptions: {
      ...shared(),
    },
    include: [
      "../.config/**/*.ts",
      "../scripts/**/*.ts",
    ],
  },
  sharedTsConfig: {
    compilerOptions: {
      ...shared(),
    },
  },
  serverTsConfig: {
    compilerOptions: {
      ...shared(),
    },
    include: [
      "../server/emails/**/*.vue",
    ],
  },
  tsConfig: {
    compilerOptions: {
      ...shared(),
    },
    vueCompilerOptions: {
      checkUnknownComponents: true,
      checkUnknownDirectives: true,
      inferComponentDollarEl: true,
      inferComponentDollarRefs: true,
      inferTemplateDollarAttrs: true,
      inferTemplateDollarEl: true,
      inferTemplateDollarRefs: true,
      inferTemplateDollarSlots: true,
      fallthroughAttributes: true,
      resolveStyleClassNames: true,
    },
  },
};

export default config;
