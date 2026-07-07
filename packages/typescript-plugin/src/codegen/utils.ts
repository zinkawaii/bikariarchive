import type { CodeInformation } from "@volar/language-core";
import type { Code } from "../types";

export class Boundary {
  private constructor(
    public features: CodeInformation,
  ) {}

  static * start(offset: number, features: CodeInformation): Generator<Code, Boundary> {
    yield [``, offset, features];
    return new Boundary(features);
  }

  end(offset: number): Code {
    return [``, offset, this.features];
  }
}
