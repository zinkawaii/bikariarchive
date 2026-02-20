import { defineConfig } from "tsdown";

export default defineConfig({
    format: "cjs",
    external: [
        "micromark-util-symbol",
        "propathy",
    ],
});
