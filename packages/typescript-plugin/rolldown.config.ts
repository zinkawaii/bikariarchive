import { defineConfig } from "rolldown";
import packageJson from "./package.json" with { type: "json" };

export default defineConfig({
  input: "src/index.ts",
  output: {
    sourcemap: true,
  },
  external: new RegExp(
    `^(?:${Object.keys(packageJson.dependencies).join("|")})(?:\\/|$)`,
  ),
});
