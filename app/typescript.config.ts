import type { NuxtConfig } from "@nuxt/schema";
import type { TSConfig } from "pkg-types";

const shared: TSConfig["compilerOptions"] = {
    strictFunctionTypes: false,
    noUncheckedIndexedAccess: false,
    paths: {
        "@bikari/article": ["../packages/article/src"],
    },
};

export default <NuxtConfig["typescript"]> {
    nodeTsConfig: {
        compilerOptions: shared,
    },
    tsConfig: {
        compilerOptions: {
            types: [
                "@types/wicg-file-system-access",
            ],
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
