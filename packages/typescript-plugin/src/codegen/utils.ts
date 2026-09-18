import type { CodeInformation } from "@volar/language-core";
import type { Code } from "../types.ts";

export class Boundary {
  private code: Code;
  private constructor(code: Code) {
    this.code = code;
  }

  static * start(start: number, end: number, features: CodeInformation): Generator<Code, Boundary> {
    yield [``, start, features];
    return new Boundary([``, end, features]);
  }

  end() {
    return this.code;
  }
}

export function* generateCamelized(code: string, offset: number, features: CodeInformation): Generator<Code> {
  const parts = code.split("-");

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part !== "") {
      if (i === 0) {
        yield [part, offset, features];
      }
      else {
        yield [capitalize(part), offset, features];
      }
    }
    offset += part.length + 1;
  }
}

export function capitalize(text: string) {
  return text[0]?.toUpperCase() + text.slice(1);
}
