import type { CodeInformation } from "@volar/language-core";

const raw = {
  all: {
    verification: true,
    completion: true,
    semantic: true,
    navigation: true,
  },
  verification: {
    verification: true,
  },
} satisfies Record<string, CodeInformation>;

export const codeFeatures = raw as {
  [T in keyof typeof raw]: CodeInformation;
};
