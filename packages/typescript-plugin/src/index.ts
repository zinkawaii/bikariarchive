import { createLanguageServicePlugin } from "@volar/typescript/lib/quickstart/createLanguageServicePlugin.js";
import { createLanguagePlugin } from "./languagePlugin.ts";

export default createLanguageServicePlugin((ts, info) => {
  return {
    languagePlugins: [
      createLanguagePlugin(
        info.project.getCompilerOptions(),
        info.config,
      ),
    ],
  };
});
