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
