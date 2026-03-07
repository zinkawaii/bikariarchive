import type { NuxtConfig } from "@nuxt/schema";
import type { TSConfig } from "pkg-types";

const shared: TSConfig["compilerOptions"] = {
    strictFunctionTypes: false,
    noUncheckedIndexedAccess: false,
};

export default <NuxtConfig["typescript"] & Record<"serverTsConfig", TSConfig>> {
    nodeTsConfig: {
        compilerOptions: {
            ...shared,
        },
        include: [
            "../packages/*/*.ts",
            "../scripts/**/*.ts",
        ],
    },
    sharedTsConfig: {
        compilerOptions: {
            ...shared,
        },
    },
    serverTsConfig: {
        compilerOptions: {
            ...shared,
        },
    },
    tsConfig: {
        compilerOptions: {
            ...shared,
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
