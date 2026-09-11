import type { CodeInformation } from "@volar/language-core";

export type Code = string | [
  source: string,
  offset: number,
  features: CodeInformation,
];
