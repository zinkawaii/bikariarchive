import { createLanguageServicePlugin } from "@volar/typescript/lib/quickstart/createLanguageServicePlugin";
import { createLanguagePlugin } from "./languagePlugin";

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
