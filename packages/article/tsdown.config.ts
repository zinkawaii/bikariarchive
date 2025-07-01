import { defineConfig } from "tsdown";

export default defineConfig({
    entry: [
        "./src/index.ts",
        "./src/remark/index.ts",
    ],
    define: {
        "import.meta.dev": `process.env.NODE_ENV === "development"`,
    },
});
