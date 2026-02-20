import type { CodeInformation } from "@volar/language-core";

const raw = {
    all: {
        completion: true,
        format: true,
        navigation: true,
        semantic: true,
        structure: true,
        verification: true,
    },
    verification: {
        verification: true,
    },
} satisfies Record<string, CodeInformation>;

export const codeFeatures = raw as {
    [T in keyof typeof raw]: CodeInformation;
};
