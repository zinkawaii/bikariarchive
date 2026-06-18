import { codes } from "micromark-util-symbol";
import type { Interpolation } from "mdast";
import type { Extension as FromMarkdownExtension } from "mdast-util-from-markdown";
import type { Code, Construct, Extension as MicromarkExtension } from "micromark-util-types";
import type { Processor } from "unified";
import { appendExtensions } from "./utils";

declare module "micromark-util-types" {
  interface TokenTypeMap {
    interpolation: "interpolation";
    interpolationFenceStart: "interpolationFenceStart";
    interpolationFenceEnd: "interpolationFenceEnd";
    interpolationContent: "interpolationContent";
  }
}

declare module "mdast" {
  interface RootContentMap {
    interpolation: Interpolation;
  }

  interface Interpolation extends Parent {
    type: "interpolation";
    path: string;
  }
}

export default function(this: Processor) {
  appendExtensions(this, {
    micromark: interpolation(),
    fromMarkdown: interpolationFromMarkdown(),
  });
}

function interpolation(): MicromarkExtension {
  const start: Construct = {
    tokenize(effects, ok, nok) {
      return start;

      function start(code: Code) {
        effects.enter("interpolation");
        effects.enter("interpolationFenceStart");
        effects.consume(code);
        return open;
      }

      function open(code: Code) {
        if (code !== codes.leftCurlyBrace) {
          return nok(code);
        }

        effects.consume(code);
        effects.exit("interpolationFenceStart");
        effects.enter("interpolationContent");
        effects.enter("chunkString", { contentType: "string" });
        return content;
      }

      function content(code: Code) {
        if (code === codes.eof) {
          return nok(code);
        }

        if (code === codes.rightCurlyBrace) {
          effects.exit("chunkString");
          effects.exit("interpolationContent");
          effects.enter("interpolationFenceEnd");
          effects.consume(code);
          return close;
        }

        effects.consume(code);
        return content;
      }

      function close(code: Code) {
        if (code !== codes.rightCurlyBrace) {
          return nok(code);
        }

        effects.consume(code);
        effects.exit("interpolationFenceEnd");
        effects.exit("interpolation");
        return ok(code);
      }
    },
  };

  return {
    text: {
      [codes.leftCurlyBrace]: [start],
    },
  };
}

function interpolationFromMarkdown(): FromMarkdownExtension {
  return {
    enter: {
      interpolation(token) {
        this.enter({
          type: "interpolation",
          path: "",
          data: {
            hName: "interpolation",
            hChildren: [],
          },
          children: [],
        }, token);
      },
      interpolationContent() {
        this.stack.push({ type: "fragment", children: [] });
      },
    },
    exit: {
      interpolation(token) {
        const element = this.stack.at(-1) as Interpolation;
        element.data!.hProperties = {
          path: element.path,
        };
        this.exit(token);
      },
      interpolationContent() {
        const data = this.resume();
        const element = this.stack.at(-1) as Interpolation;
        element.path = data.trim();
      },
    },
  };
}
