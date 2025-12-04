import type { NuxtConfig } from "@nuxt/schema";
import type { TSConfig } from "pkg-types";

const shared: TSConfig["compilerOptions"] = {
    strictFunctionTypes: false,
    noUncheckedIndexedAccess: false,
};

export default <NuxtConfig["typescript"]> {
    nodeTsConfig: {
        compilerOptions: {
            ...shared,
        },
    },
    sharedTsConfig: {
        compilerOptions: {
            ...shared,
        },
    },
    tsConfig: {
        compilerOptions: {
            types: [
                "@types/wicg-file-system-access",
            ],
            ...shared,
        },
        include: [
            "../data/**/*.mdz",
        ],
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
