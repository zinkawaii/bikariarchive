import { defineConfig } from "tsup";

export default defineConfig({
    entry: [
        "./src/index.ts",
        "./src/remark/index.ts"
    ],
    format: [
        "cjs",
        "esm"
    ],
    clean: true,
    dts: true,
    define: {
        __TIME__: `${new Date().getTime()}`
    }
});